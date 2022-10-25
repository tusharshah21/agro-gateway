const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const General = require("../models/General");

//* customer dash
router.get("/", (req, res) => {
	// console.log(req.body);
	// req.session.user = req.user;
	// console.log("req.session.user = " + req.session.user);
	res.render("gp/gp_dash", { user: req.session.user });
});

//* GP registration
router.get("/signup", (req, res) => {
	// console.log(req.body);
	// req.session.user = req.user;
	// console.log("req.session.user = " + req.session.user);
	res.render("login");
});

router.post("/signup", async (req, res) => {
	console.log(req.body);
	try {
		const user = new General(req.body);
		let uniquenumberExists = await General.findOne({ uniquenumber: req.body.uniquenumber });
		let emailExists = await General.findOne({ email: req.body.email });

		console.log("Username: " + uniquenumberExists, "email: " + emailExists);

		if (uniquenumberExists || emailExists) {
			return res
				.status(400)
				.send(
					"<h2 style='text-align:center;margin-top:200px;font-size:40px;'>Username or email already exists 🥹🥹🥹!</h1>"
				);
		} else {
			await General.register(user, req.body.password, (error) => {
				if (error) {
					throw error;
				}
				res.redirect("/");
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

// export
module.exports = router;
