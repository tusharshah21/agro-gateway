const express = require("express");
const router = express.Router();
const User = require("../models/Users");

//  dash
router.get("/", (req, res) => {
	res.render("fo/fo_dash");
});

// members
router.get("/members", (req, res) => {
	res.render("fo/uf_members");
});

router.get("/products", (req, res) => {
	res.render("fo/products");
});

// registration
router.get("/register", (req, res) => {
	res.render("fo/fo_registration");
});

router.post("/register", async (req, res) => {
	console.log(req.body);
	try {
		const user = new User(req.body);
		let uniqueExists = await User.findOne({ uniquenumber: req.body.uniquenumber });
		console.log(uniqueExists);

		if (uniqueExists) {
			return res
				.status(400)
				.send(
					"<h2 style='text-align:center;margin-top:200px;font-size:100px;'>User already Exists 😭</h2>"
				);
		} else {
			await User.register(user, req.body.password, (error) => {
				if (error) {
					throw error;
				}
				res.send(
					"<h1 style='text-align:center;margin-top:10%;font-size:70px'>Registered 😊</h1>"
				);
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
