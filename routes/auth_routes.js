const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
	res.render("login");
});

router.post("/", passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => {
	req.session.user = req.user;
	const user = req.session.user;
	console.log("User: " + user.email);
	if (user.role === "Agriculture Officer") {
		res.redirect("/ao");
	} else if (user.role === "Farmer One") {
		res.redirect("/fo");
	} else if (user.role === "Urban Farmer") {
		res.redirect("/uf");
	} else {
		res.redirect("/");
	}
});

router.post("/logout", (req, res) => {
	if (req.session) {
		req.session.destroy(function (err) {
			if (err) {
				res.status(400).send("Unable to logout");
			} else {
				return res.redirect("/");
			}
		});
	}
	// res.redirect("/login");
});

module.exports = router;
