const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	seller: {
		type: mongoose.Types.ObjectId,
		ref: "User",
	},

	producename: {
		type: mongoose.Types.ObjectId,
		ref: "Produce",
	},

	quantity: Number,

	orderdate: {
		type: Date,
		default: new Date(),
	},

	customer: {
		type: mongoose.Types.ObjectId,
		ref: "General",
	},
});

module.exports = mongoose.model("Order", orderSchema);
