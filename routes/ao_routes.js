const express = require("express");
const router = express.Router();

// register route
router.get("/", (req, res) => {
	res.render("ao/ao_dash.pug");
});

router.get("/members", (req, res) => {
	res.render("ao/members");
});

router.get("/gp", (req, res) => {
	res.render("ao/general_public");
});

router.get("/register", (req, res) => {
	res.render("ao/registration");
});

router.post("/register", (req, res) => {
	console.log(req.body);
	res.send(`<h1 style='text-align:center;margin-top:10%;font-size:70px'>Registered 😊</h1>`);
});

router.get("/products", (req, res) => {
	res.render("products");
});

module.exports = router;
