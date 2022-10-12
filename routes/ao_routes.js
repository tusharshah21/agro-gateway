const express = require("express");
const router = express.Router();

// register route
router.get("/register", (req, res) => {
	res.render("ao/registration");
});

router.post("/register", (req, res) => {
	console.log(req.body);
	res.send(`<h1 style='text-align:center;margin-top:10%;font-size:70px'>Registered 😊</h1>`);
});

module.exports = router;
