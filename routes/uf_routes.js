const connectEnsureLogin = require("connect-ensure-login");
const express = require("express");
const router = express.Router();
const Produce = require("../models/Produce");
const multer = require("multer");

// image upload
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/uploads");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

// instantiate variable upload to store multer functionality to upload image
const upload = multer({ storage: storage });

//* Dashboard
router.get("/", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Urban Farmer") {
		res.render("uf/uf_dash", { user: req.session.user });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As an Urban Farmer 🤷</h2>`
		);
	}
});

//* Uploaded Produce
router.get("/uploaded", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Urban Farmer") {
		const produce = await Produce.find({ uploadedby: user }).sort({ $natural: -1 });
		// for (let i = 0; i < produce.length; i++) {
		// 	console.log(i.uploadedby);
		// }
		res.render("uf/uf_uploaded", { user: req.session.user, produce: produce });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Urban Farmer 🤷</h2>`
		);
	}
});

// * Approved * * * * * * * * * * * * * *

router.get("/approved", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Urban Farmer") {
		const produce = await Produce.find({ uploadedby: user }).sort({ $natural: -1 });
		res.render("uf/uf_approved", { user: req.session.user, produce: produce });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Urban Farmer 🤷</h2>`
		);
	}
});

//* Upload Produce
router.get("/upload", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Urban Farmer") {
		res.render("uf/uf_upload", { user: req.session.user }); //req.session.user
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Urban Farmer 🤷</h2>`
		);
	}
});

router.post(
	"/upload",
	connectEnsureLogin.ensureLoggedIn(),
	upload.single("produceimg"),
	async (req, res) => {
		console.log(req.body);
		try {
			const produce = new Produce(req.body);
			produce.produceimg = req.file.path;
			await produce.save();
			res.redirect("/uf/uploaded");
		} catch (error) {
			res.status(400).send("Product not Saved.");
			console.log(error);
		}
	}
);

// * Update Produce
router.get("/update/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Urban Farmer") {
		try {
			const updateProduce = await Produce.findOne({ _id: req.params.id });
			res.render("uf/uf_update", { user: req.session.user, produce: updateProduce });
		} catch (error) {
			res.status(400).send("Product to update not found.");
		}
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Urban Farmer 🤷</h2>`
		);
	}
});

router.post("/update", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		await Produce.findOneAndUpdate({ _id: req.query.id }, req.body);
		res.redirect("/uf/uploaded");
	} catch (error) {
		res.status(400).send("Product not Updated.");
	}
});

// * Delete Produce
router.post("/delete", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		await Produce.deleteOne({ _id: req.body.id });
		res.redirect("/uf/uploaded");
	} catch (error) {
		console.log(error);
		res.status(400).send(
			`<h2 style='text-align:center;margin-top:200px;font-size:30px;'>Product not Deleted. 🥹</h2>`
		);
	}
});

module.exports = router;
