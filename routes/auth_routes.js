const express = require("express");
const router = express.Router();
const passport = require("passport");

// router.get("/", (req, res) => {
// 	res.render("login");
// });

// router.post("/", (req, res) => {
// 	res.send(`<h1 style='text-align:center;margin-top:10%;font-size:70px'>Registered 😊</h1>`);
// });

// const express = require("express");
// const router = express.Router();

router.get("/", (req, res) => {
	res.render("login");
});

router.post("/", passport.authenticate("local", { failureRedirect: "/" }), (req, res) => {
	console.log("User: ", req.session.user);
	res.redirect("/uf/uf_upload");
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
