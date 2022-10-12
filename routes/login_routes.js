const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("login");
});

router.post("/", (req, res) => {
	res.send(`<h1 style='text-align:center;margin-top:10%;font-size:70px'>Registered 😊</h1>`);
});

module.exports = router;
