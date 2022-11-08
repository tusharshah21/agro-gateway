const connectEnsureLogin = require("connect-ensure-login");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Produce = require("../models/Produce");
const User = require("../models/Users");
// const General = require("../models/General");
const Order = require("../models/Orders");

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

//* * * * * * * * * * * * * * * * * * * * * * * * *  Dashboard * * * * * * * * * * * * * * * *

router.get("/", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Urban Farmer") {
		try {
			// =================================POULTRY =================================================
			// All Poultry
			let totalPoultry = await Produce.aggregate([
				// { $match: { producetype: "poultry" } },
				{
					$match: {
						$and: [
							{ producetype: "poultry" },
							{ status: "approved" },
							{ ward: user.ward },
						],
					},
				},
				{
					$group: {
						_id: "$all",
						totalQuantity: { $sum: "$quantity" },
						totalCost: { $sum: { $multiply: ["$price", "$quantity"] } },
					},
				},
			]);

			// Ordered Poultry
			let totalPoultryOrder = await Order.aggregate([
				{
					$match: {
						$and: [
							{ status: { $in: ["pending", "complete"] } },
							{ producetype: "poultry" },
							{ seller: user._id },
						],
					},
				},
				{
					$group: {
						_id: "$all",
						totalQuantity: { $sum: "$quantity" },
						totalCost: { $sum: { $multiply: ["$price", "$quantity"] } },
					},
				},
			]);

			// console.log("Poultry collections", totalPoultryOrder);

			// ============================HORTICULTURE =============================
			// All Hort
			let totalHort = await Produce.aggregate([
				// { $match: { producetype: "horticulture" } },

				{
					$match: {
						$and: [
							{ producetype: "horticulture" },
							{ status: "approved" },
							{ ward: user.ward },
						],
					},
				},

				{
					$group: {
						_id: "$approved",
						totalQuantity: { $sum: "$quantity" },
						totalCost: { $sum: { $multiply: ["$price", "$quantity"] } },
					},
				},
			]);

			// Ordered Hort
			let totalHortOrder = await Order.aggregate([
				{
					$match: {
						$and: [
							{ status: { $in: ["pending", "complete"] } },
							{ producetype: "horticulture" },
							{ seller: user._id },
						],
					},
				},
				{
					$group: {
						_id: "$all",
						totalQuantity: { $sum: "$quantity" },
						totalCost: { $sum: { $multiply: ["$price", "$quantity"] } },
					},
				},
			]);

			// console.log("Hort collections", totalHortOrder);

			// ===============================DAIRY======================================
			// All dairy
			let totalDairy = await Produce.aggregate([
				// { $match: { producetype: "dairy" } },
				{
					$match: {
						$and: [
							{ producetype: "dairy" },
							{ status: "approved" },
							{ ward: user.ward },
						],
					},
				},

				{
					$group: {
						_id: "$all",
						// _id:user._id,
						totalQuantity: { $sum: "$quantity" },
						totalCost: { $sum: { $multiply: ["$price", "$quantity"] } },
					},
				},
			]);

			// Ordered Dairy
			let totalDairyOrder = await Order.aggregate([
				{
					$match: {
						$and: [
							{ status: { $in: ["pending", "complete"] } },
							{ producetype: "dairy" },
							{ seller: user._id },
						],
					},
				},
				{
					$group: {
						_id: "$all",
						totalQuantity: { $sum: "$quantity" },
						totalCost: { $sum: { $multiply: ["$price", "$quantity"] } },
					},
				},
			]);

			// console.log("Dairy collections", totalDairyOrder);

			let totalGP = await User.find({ role: "Customer" }).count();
			let totalUF = await User.find({ role: "Urban Farmer" }).count();
			let totalFO = await User.collection.countDocuments({
				$and: [{ status: "active" }, { role: "Farmer One" }],
			});

			const produces = await Produce.find({
				$and: [{ status: "approved" }, { ward: user.ward }],
			})
				.sort({ price: -1 })
				.limit(5);
			// console.log(produces);

			const orders = await Order.find({ seller: user._id }).sort({ orderdate: -1 }).limit(5);

			// console.log(totalPoultry);
			res.render("uf/uf_dash", {
				user,
				produces,
				orders,
				totalP: totalPoultry[0],
				totalH: totalHort[0],
				totalD: totalDairy[0],
				totalPO: totalPoultryOrder[0],
				totalDO: totalDairyOrder[0],
				totalHO: totalHortOrder[0],
				totalFO: totalFO,
				totalGP: totalGP,
				totalUF: totalUF,
			});
		} catch (error) {
			console.log(error);
			res.status(404).send("Unable to find Produce");
		}
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As an Urban Farmer 🤷</h2>`
		);
	}
});

//* * * * * * * * * * * * * * * * * * * * * * * * *  Uploaded Produce * * * * * * * * * * * * * * * * * * * * * * * *

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

// * * * * * * * * * * * * * * * * * Approved * * * * * * * * * * * * * *

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

//* * * * * * * * * * * * * * * * * Upload Produce * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

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

// * * * * * * * * * * * * * * * * *  Update Produce * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// router.get("/update/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
// 	const user = req.session.user;
// 	if (user.role === "Urban Farmer") {
// 		try {
// 			const updateProduce = await Produce.findOne({ _id: req.params.id });
// 			res.render("uf/uf_update", { user: req.session.user, produce: updateProduce });
// 		} catch (error) {
// 			res.status(400).send("Product to update not found.");
// 		}
// 	} else {
// 		res.send(
// 			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Urban Farmer 🤷</h2>`
// 		);
// 	}
// });

router.post("/update/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		await Produce.findOneAndUpdate({ _id: req.params.id }, req.body);
		console.log(req.body, req.params.id);
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

// * * * * * * * * * * * * * * * * * * * Orders * * * * * * * * * * * * * * * * * * * * *

router.get("/add_orders", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Urban Farmer") {
		let selectedProduce;
		if (req.query.searchproduce) selectedProduce = req.query.searchproduce;
		const item = await Produce.findOne({ _id: selectedProduce });
		// console.log(item);

		let selectedCustomer;
		if (req.query.searchcustomer) selectedCustomer = req.query.searchcustomer;
		const customer = await User.findOne({ _id: selectedCustomer });

		const customers = await User.find({ role: "Customer" });
		const produces = await Produce.find({ uploadedby: user._id });
		// console.log(produces, user);
		res.render("uf/add_orders", { user, customers, produces, item, customer });
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Urban Farmer 🤷</h2>`
		);
	}
});

router.post("/add_orders", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Urban Farmer") {
		console.log(req.body);
		try {
			const order = new Order(req.body);
			await order.save();
			res.redirect("/uf/add_orders");
		} catch (error) {
			res.status(400).send("Order not Created.");
			console.log(error);
		}
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Urban Farmer 🤷</h2>`
		);
	}
});

// get orders
router.get("/orders", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	req.session.user = req.user;
	const user = req.session.user;
	if (user.role === "Urban Farmer") {
		try {
			const orders = await Order.find({ seller: user._id });
			res.render("uf/orders", { user, orders });
		} catch (error) {
			res.status(400).send("Couldn't get orders");
		}
	} else {
		res.send(
			`<h2 style='text-align:center;margin-top:200px;font-size:50px;'>Please Login As Urban Farmer 🤷</h2>`
		);
	}
});

// update Order Status
router.post("/orders/:id", async (req, res) => {
	try {
		const id = req.params.id;
		console.log(req.body, id);
		const prod = await Order.findOneAndUpdate({ _id: id }, req.body);
		console.log(prod);
		res.redirect("/uf/orders");
	} catch (error) {
		res.status(400).send("Product not Updated.");
	}
});

module.exports = router;
