const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const User = require("../models/Users");
const Produce = require("../models/Produce");

//* * * * * * * * * * * * * * * * * * *  DASHBOARD * * * * * * * * * * * * * * * * * * * * * * * *
router.get("/", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	req.session.user = req.user;
	const user = req.session.user;
	const produce = await Produce.find({ status: "approved" });
	// console.log(produce);
	// console.log(req.body);
	// req.session.user = req.user;
	// console.log("req.session.user = " + req.session.user);
	res.render("gp/gp_dash", { user, produce: produce });
});

//* * * * * * * * * * * * * * * * * * *  GP registration * * * * * * * * * * * * * * * * * * * * * * * *
router.get("/signup", (req, res) => {
	// console.log(req.body);
	// req.session.user = req.user;
	// console.log("req.session.user = " + req.session.user);
	res.render("login");
});

router.post("/signup", async (req, res) => {
	// console.log(req.body);
	try {
		const user = new User(req.body);
		let uniquenumberExists = await User.findOne({ uniquenumber: req.body.uniquenumber });
		let emailExists = await User.findOne({ email: req.body.email });

		// console.log("Username: " + uniquenumberExists, "email: " + emailExists);

		if (uniquenumberExists || emailExists) {
			return res
				.status(400)
				.send(
					"<h2 style='text-align:center;margin-top:200px;font-size:40px;'>Username or email already exists 🥹🥹🥹!</h1>"
				);
		} else {
			await User.register(user, req.body.password, (error) => {
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
		// console.log(error);
		// catch more errors.... registrationn with existing id
	}
});

// router.get("/cart", (req, res) => {
// 	res.render("gp/gp_cart");
// });
// export
module.exports = router;
