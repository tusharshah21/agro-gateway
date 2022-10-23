const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const User = require("../models/Users");
const Produce = require("../models/Produce");

router.get("/agricosignup", (req, res) => {
	res.render("ao/ao_signup");
});

router.post("/aosignup", async (req, res) => {
	console.log(req.body);
	try {
		const user = new User(req.body);
		let uniqueExists = await User.findOne({ uniquenumber: req.body.uniquenumber });
		let emailExists = await User.findOne({ email: req.body.email });

		if (uniqueExists || emailExists) {
			console.log("unique:" + uniqueExists, "email: " + emailExists);
			return res.status(400).send(
				`<h2 style='text-align:center;margin-top:100px;font-size:100px;'>User already Exists 😭</h2>
					<p style='text-align:center;margin-top:5px;font-size:40px;'>Try new email or unique Number <span style='font-size:80px'/>🤷</span></p>`
			);
		} else {
			await User.register(user, req.body.password, (error) => {
				// console.log(req.body.password);
				if (error) {
					throw error;
				}
				res.redirect("/login");
			});
		}
	} catch (error) {
		res.status(400).send(
			"<h2 style='text-align:center;margin-top:200px;font-size:100px;'>Something went wrong 🥹🥹🥹!</h1>"
		);
		console.log(error);
		// catch more errors.... registrationn with existing id
	}
});

//* register route
router.get("/", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	user = req.user;
	if (user.role === "Agriculture Officer") {
		res.render("ao/ao_dash.pug", { user: user });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Agriculture Officer 🤷</h2>`
		);
	}
});

router.get("/members", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const members = await User.find({ role: { $in: ["Farmer One", "Urban Farmer"] } });
	console.log(members);
	if (user.role === "Agriculture Officer") {
		res.render("ao/members", { members: members });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Agriculture Officer 🤷</h2>`
		);
	}
});

router.get("/gp", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	user = req.user;
	if (user.role === "Agriculture Officer") {
		res.render("ao/general_public_list");
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Agriculture Officer 🤷</h2>`
		);
	}
});

router.get("/register", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	user = req.user;
	if (user.role === "Agriculture Officer") {
		res.render("ao/ao_registration");
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Agriculture Officer 🤷</h2>`
		);
	}
});

router.post("/register", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	user = req.user;
	if (user.role === "Agriculture Officer") {
		// console.log(req.body);
		try {
			const user = new User(req.body);
			let uniqueExists = await User.findOne({ uniquenumber: req.body.uniquenumber });
			let emailExists = await User.findOne({ email: req.body.email });

			if (uniqueExists || emailExists) {
				console.log("unique:" + uniqueExists, "email: " + emailExists);
				return res.status(400).send(
					`<h2 style='text-align:center;margin-top:100px;font-size:100px;'>User already Exists 😭</h2>
					<p style='text-align:center;margin-top:5px;font-size:40px;'>Try new email or unique Number <span style='font-size:80px'/>🤷</span></p>`
				);
			} else {
				await User.register(user, req.body.password, (error) => {
					// console.log(req.body.password);
					if (error) {
						throw error;
					}
					res.redirect("/ao/members");
				});
			}
		} catch (error) {
			res.status(400).send(
				"<h2 style='text-align:center;margin-top:200px;font-size:100px;'>Something went wrong 🥹🥹🥹!</h1>"
			);
			console.log(error);
			// catch more errors.... registrationn with existing id
		}
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Agriculture Officer 🤷</h2>`
		);
	}
});

router.get("/products", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	user = req.user;
	const produce = await Produce.find();
	if (user.role === "Agriculture Officer") {
		res.render("ao/products", { produce: produce });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Agriculture Officer 🤷</h2>`
		);
	}
});

module.exports = router;
