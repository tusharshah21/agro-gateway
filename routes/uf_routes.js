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

// dash
router.get("/", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.user;
	res.render("uf/uf_dash", { user: user });
});

router.get("/uploaded", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const produce = await Produce.find().sort({ $natural: -1 });
	res.render("uf/uploaded", { produce: produce });
});

router.get("/upload", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	const currentUser = req.user;
	res.render("uf/uf_upload", { currentUser: currentUser }); //req.session.user
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
	const currentUser = req.user;
	try {
		const updateProduce = await Produce.findOne({ _id: req.params.id });
		res.render("uf/uf_update", { currentUser: currentUser, updateProduce: updateProduce });
	} catch (error) {
		res.status(400).send("Product to update not found.");
	}
});

router.post("/update", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		await Produce.findOneAndUpdate({ _id: req.query.id }, req.body);
		res.redirect("/uf/uploaded", { produce: req.body });
	} catch (error) {
		res.status(400).send("Product not Updated.");
	}
});

// * Delete Produce
router.post("/delete", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		await Produce.deleteOne({ _id: req.body.id });
		req.redirect("back");
	} catch (error) {
		res.status(400).send("Product not Deleted.");
	}
});

module.exports = router;
