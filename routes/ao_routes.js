const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const multer = require("multer");
const User = require("../models/Users");
const Produce = require("../models/Produce");
const General = require("../models/General");

// image upload
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/uploads");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

// instantiate variable upload to store multer functionality to upload image
const upload = multer({ storage: storage });

//* * * * * * *  * * * * * * * * Agriculture Officer Signup  * * * * * * * * * * * * * * * * * *

router.get("/agricosignup", (req, res) => {
	res.render("ao/ao_signup");
});

// agricosignup
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

//*  * * * * * * * * * * * * * * * * * * Dashboard  * * * * * * * * * * * * * * * * * * * * * * * *

router.get("/", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	const produce = await Produce.find();
	if (user.role === "Agriculture Officer") {
		try {
			let totalPoultry = await Produce.aggregate([
				{ $match: { producetype: "poultry" } },
				{
					$group: {
						_id: "$all",
						totalQuantity: { $sum: "$quantity" },
						totalCost: { $sum: { $multiply: ["$price", "$quantity"] } },
					},
				},
			]);

			let totalHort = await Produce.aggregate([
				{ $match: { producetype: "horticulture" } },
				{
					$group: {
						_id: "$all",
						totalQuantity: { $sum: "$quantity" },
						totalCost: { $sum: { $multiply: ["$price", "$quantity"] } },
					},
				},
			]);
			let totalDairy = await Produce.aggregate([
				{ $match: { producetype: "dairy" } },
				{
					$group: {
						_id: "$all",
						totalQuantity: { $sum: "$quantity" },
						totalCost: { $sum: { $multiply: ["$price", "$quantity"] } },
					},
				},
			]);
			let totalGP = await General.collection.countDocuments();
			let totalFO = await User.collection.countDocuments({ role: "Farmer One" });
			let totalUF = await User.collection.countDocuments({ role: "Urban Farmer" });

			console.log("Poultry collections", totalGP);
			console.log("Hort collections", totalFO);
			console.log("Dairy collections", totalUF);
			res.render("ao/ao_dash.pug", {
				user: req.session.user,
				produce: produce,
				totalP: totalPoultry[0],
				totalH: totalHort[0],
				totalD: totalDairy[0],
				totalFO,
				totalUF,
				totalGP,
			});
		} catch (error) {
			res.status(400).send("Unable to retrieve items from database");
		}
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Agriculture Officer 🤷</h2>`
		);
	}
});

//  * * * * * * * * * * * * * * * * * * Members * * * * * * * * * * * * * * * * *

router.get("/members", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	const members = await User.find({ role: { $in: ["Farmer One", "Urban Farmer"] } });
	console.log(members);
	if (user.role === "Agriculture Officer") {
		res.render("ao/members", { user: req.session.user, members: members });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Agriculture Officer 🤷</h2>`
		);
	}
});

//  * * * * * * * * * * * * * * * * * * General Public  * * * * * * * * * * * * * * * * * * * * * * * *

router.get("/gp", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	const user = req.session.user;
	if (user.role === "Agriculture Officer") {
		res.render("ao/general_public_list", { user: req.session.user });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Agriculture Officer 🤷</h2>`
		);
	}
});

//  * * * * * * * * * * * * * * * * * * Register Farmer One  * * * * * * * * * * * * * * * * * *

router.get("/register", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	const user = req.session.user;
	if (user.role === "Agriculture Officer") {
		res.render("ao/ao_registration", { user: req.session.user });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Agriculture Officer 🤷</h2>`
		);
	}
});

router.post(
	"/register",
	connectEnsureLogin.ensureLoggedIn(),
	upload.single("avatar"),
	async (req, res) => {
		const user = req.session.user;
		if (user.role === "Agriculture Officer") {
			// console.log(req.body);
			try {
				const user = new User(req.body);
				if (req.file.path) {
					user.avatar = req.file.path;
				}
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
	}
);

//  * * * * * * * * * * * * * * * * * * Update Farmer One  * * * * * * * * * * * * * * * * * *

router.get("/farmerones", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Agriculture Officer") {
		const farmerOnes = await User.find({ role: "Farmer One" });
		res.render("ao/ao_farmerone", { user, farmerones: farmerOnes });
	}
});

router.get("/foupdate/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Agriculture Officer") {
		try {
			const updateFO = await User.findOne({ _id: req.params.id });
			res.render("ao/fo_update", { user: req.session.user, farmerone: updateFO });
		} catch (error) {
			res.status(400).send("Farmer to update not found.");
		}
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Agriculture Officer 🤷</h2>`
		);
	}
});

router.post("/foupdate", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Agriculture Officer") {
		try {
			await User.findOneAndUpdate({ _id: req.query.id }, req.body);
			res.redirect("/ao/farmerones");
		} catch (error) {
			res.status(400).send("Farmer not Updated.");
		}
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Agriculture Officer 🤷</h2>`
		);
	}
});

// * * * * * * * * * * * * * * * * * * * Products Page  * * * * * * * * * * * * * * * * * *

router.get("/products", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	const produce = await Produce.find();
	if (user.role === "Agriculture Officer") {
		res.render("ao/products", { user: req.session.user, produce: produce });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Agriculture Officer 🤷</h2>`
		);
	}
});

// * * * * * * * * * * * * * * * * * * * Reports  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

router.get("/", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	const produce = await Produce.find();
	if (user.role === "Agriculture Officer") {
		res.render("ao/ao_report", { user: req.session.user, produce: produce });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Agriculture Officer 🤷</h2>`
		);
	}
});

module.exports = router;
