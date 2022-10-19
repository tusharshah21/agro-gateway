const { Router } = require("express");
const router = Router();
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
router.get("/", (req, res) => {
	res.render("uf/uf_dash");
});

router.get("/upload", (req, res) => {
	res.render("uf/uf_upload");
});

router.post("/upload", upload.single("produceimg"), async (req, res) => {
	console.log(req.body);
	try {
		const produce = new Produce(req.body);
		produce.produceimg = req.file.path;
		await produce.save();
		res.redirect("/uf");
	} catch (error) {
		res.status(400).send("Product not Saved.");
		console.log(error);
	}
});

module.exports = router;
