const express = require("express");
const router = express.Router();
const passport = require("passport");

// * * * * * * * * * * * * * * * * * Login * * * * * * * * * * * * * * * * * * * * * * * * *
// login get
router.get("/", (req, res) => {
	res.render("login");
});

// login post
router.post("/", passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => {
	req.session.user = req.user;
	const user = req.session.user;
	req.flash("login", "Welcome Back!");
	// console.log("User Email: " + user.email, "Unique Id: " + user.uniquenumber);
	if (user.role === "Agriculture Officer" && user.status === "active") {
		res.redirect("/ao");
	} else if (user.role === "Farmer One" && user.status === "active") {
		res.redirect("/fo");
	} else if (user.role === "Urban Farmer" && user.status === "active") {
		res.redirect("/uf");
	} else {
		res.redirect("/");
	}
});

// * * * * * * * * * * * * * * * * * Logout * * * * * * * * * * * * * * * * *

router.post("/logout", (req, res) => {
	if (req.session) {
		req.session.destroy(function (err) {
			if (err) {
				res.status(400).send("Unable to logout");
			} else {
				return res.redirect("/login");
			}
		});
	}
	// res.redirect("/login");
});

// export routes
module.exports = router;
