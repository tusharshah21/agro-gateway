const express = require("express");
const router = express.Router();
const multer = require("multer");
const connectEnsureLogin = require("connect-ensure-login");
const User = require("../models/Users");
const Produce = require("../models/Produce");

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

//  dash
router.get("/", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	const user = req.session.user;
	if (user.role === "Farmer One") {
		res.render("fo/fo_dash", { user: req.session.user });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Farmer One 🤷</h2>`
		);
	}
});

// members
router.get("/members", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Farmer One") {
		const members = await User.find({ role: "Urban Farmer" });
		res.render("fo/fo_members", { user: req.session.user, members: members });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Farmer One 🤷</h2>`
		);
	}
});

router.get("/products", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Farmer One") {
		const produce = await Produce.find().sort({ status: -1 });
		res.render("fo/products", { user: req.session.user, produce: produce });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Farmer One 🤷</h2>`
		);
	}
});

// registration
router.get("/register", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	const user = req.session.user;
	if (user.role === "Farmer One") {
		res.render("fo/fo_registration", { user: req.session.user });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Farmer One 🤷</h2>`
		);
	}
});

router.post(
	"/register",
	connectEnsureLogin.ensureLoggedIn(),
	upload.single("avatar"),
	async (req, res) => {
		console.log(req.body);
		const user = req.session.user;
		if (user.role === "Farmer One") {
			try {
				const user = new User(req.body);
				if (req.file && req.file.originalname) {
					user.avatar = req.file.path;
				}
				let uniqueExists = await User.findOne({ uniquenumber: req.body.uniquenumber });
				let emailExists = await User.findOne({ email: req.body.email });

				console.log("unique Num: " + uniqueExists, "email: " + emailExists);

				if (uniqueExists || emailExists) {
					return res.status(400).render("fo/fo_user_exists");
				} else {
					await User.register(user, req.body.password, (error) => {
						if (error) {
							throw error;
						}
						res.redirect("/fo/members");
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
				`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Farmer One 🤷</h2>`
			);
		}
	}
);

// * Approve Produce
router.get("/approve/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Farmer One") {
		try {
			const updateProduce = await Produce.findOne({ _id: req.params.id });
			res.render("fo/fo_approve", { user: req.session.user, produce: updateProduce });
		} catch (error) {
			res.status(400).send("Product to update not found.");
		}
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Farmer One 🤷</h2>`
		);
	}
});

router.post("/approve", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		await Produce.findOneAndUpdate({ _id: req.query.id }, req.body);
		res.redirect("/fo/products");
	} catch (error) {
		res.status(400).send("Product not Updated.");
	}
});

module.exports = router;
