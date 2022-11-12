const express = require("express");
const router = express.Router();
const multer = require("multer");
const connectEnsureLogin = require("connect-ensure-login");
const User = require("../models/Users");
const Produce = require("../models/Produce");
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

//* ************************************ Dashboard ****************************************

router.get("/", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;

	if (user.role === "Farmer One" && user.status === "active") {
		try {
			const produces = await Produce.find({ status: "approved" })
				.sort({ price: -1 })
				.limit(5);

			const orders = await Order.find().sort({ orderdate: -1 }).limit(5);

			const ufarmers = await User.find({ role: "Urban Farmer" });

			// ==============================POULTRY=======================================
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

			console.log("Poultry colection ", totalPoultryOrder);

			// ======================================HORTICULTURE================================
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

			console.log("Hort collections", totalHortOrder);

			// ======================================DAIRY=========================================
			// All Dairy
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

			console.log("Dairy collections", totalDairyOrder);

			let totalGP = await User.find({ role: "Customer" }).count();
			let totalUF = await User.collection.countDocuments({
				role: "Urban Farmer",
			});
			let totalFO = await User.collection.countDocuments({
				$and: [{ status: "active" }, { role: "Farmer One" }],
			});

			// console.log(totalPoultry);
			res.render("fo/fo_dash", {
				user,
				produces,
				orders,
				ufarmers,
				totalP: totalPoultry[0],
				totalH: totalHort[0],
				totalD: totalDairy[0],
				totalPO: totalPoultryOrder[0],
				totalHO: totalHortOrder[0],
				totalDO: totalDairyOrder[0],
				totalFO: totalFO,
				totalGP: totalGP,
				totalUF: totalUF,
			});
		} catch (error) {
			console.log(error);
			res.status(404).send("Unable to find Produce");
		}
	} else {
		res.status(403).render("403");
	}
});

// members
router.get("/members", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Farmer One" && user.status === "active") {
		const members = await User.find({ role: "Urban Farmer", ward: user.ward });
		res.render("fo/fo_members", { user: req.session.user, members: members });
	} else {
		res.status(403).render("403");
	}
});

router.get("/products", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Farmer One" && user.status === "active") {
		const produce = await Produce.find({ ward: user.ward }).sort({ status: -1 });
		res.render("fo/products", { user: req.session.user, produce: produce });
	} else {
		res.status(403).render("403");
	}
});

// registration
router.get("/register", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	const user = req.session.user;
	if (user.role === "Farmer One" && user.status === "active") {
		res.render("fo/fo_registration", { user: req.session.user });
	} else {
		res.status(403).render("403");
	}
});

router.post(
	"/register",
	connectEnsureLogin.ensureLoggedIn(),
	upload.single("avatar"),
	async (req, res) => {
		console.log(req.body);
		const user = req.session.user;
		if (user.role === "Farmer One" && user.status === "active") {
			try {
				const user = new User(req.body);
				if (req.file && req.file.originalname) {
					user.avatar = req.file.path;
				}
				let uniqueExists = await User.findOne({ uniquenumber: req.body.uniquenumber });
				let emailExists = await User.findOne({ email: req.body.email });

				console.log("unique Num: " + uniqueExists, "email: " + emailExists);

				if (uniqueExists || emailExists) {
					return res.status(400).render("fo/fo_user_exists");
				} else {
					await User.register(user, req.body.password, (error) => {
						if (error) {
							throw error;
						}
						res.redirect("/fo/members");
					});
				}
			} catch (error) {
				res.status(400).send(
					"<h2 style='text-align:center;margin-top:200px;font-size:100px;'>Something went wrong 🥹🥹🥹!</h1>"
				);
				console.log(error);
				// catch more errors.... registrationn with existing id
			}
		} else {
			res.status(403).render("403");
		}
	}
);

// * Approve Produce
router.get("/approve/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const user = req.session.user;
	if (user.role === "Farmer One" && user.status === "active") {
		try {
			const updateProduce = await Produce.findOne({ _id: req.params.id });
			res.render("fo/fo_approve", { user: req.session.user, produce: updateProduce });
		} catch (error) {
			res.status(400).send("Product to update not found.");
		}
	} else {
		res.status(403).render("403");
	}
});

router.post("/approve/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		await Produce.findOneAndUpdate({ _id: req.params.id }, req.body);
		res.redirect("/fo/products");
	} catch (error) {
		res.status(400).send("Product not Updated.");
	}
});

// get orders
router.get("/orders", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	req.session.user = req.user;
	const user = req.session.user;
	console.log(user);
	if (user.role === "Farmer One" && user.status === "active") {
		try {
			const orders = await Order.find();
			const ufarmers = await User.find({ role: "Urban Farmer" });
			console.log(ufarmers);
			res.render("fo/orders", { user, orders, ufarmers });
		} catch (error) {
			res.status(400).send("Couldn't get orders");
		}
	} else {
		res.status(403).render("403");
	}
});

module.exports = router;
