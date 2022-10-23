const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");

//* customer dash
router.get("/", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	// console.log(req.body);
	// req.session.user = req.user;
	// console.log("req.session.user = " + req.session.user);
	res.render("gp/gp_dash");
});

// export
module.exports = router;
