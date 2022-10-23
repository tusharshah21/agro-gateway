const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const User = require("../models/Users");
const Produce = require("../models/Produce");

//  dash
router.get("/", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	const user = req.user;
	res.render("fo/fo_dash", { user: user });
});

// members
router.get("/members", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const members = await User.find({ role: "Urban Farmer" });
	res.render("fo/fo_members", { members: members });
});

router.get("/products", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const produce = await Produce.find();
	res.render("fo/products", { produce: produce });
});

// registration
router.get("/register", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	res.render("fo/fo_registration");
});

router.post("/register", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	console.log(req.body);
	try {
		const user = new User(req.body);
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
});

module.exports = router;
