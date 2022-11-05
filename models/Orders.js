const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	seller: String,
	customer: String,

	producename: String,
	price: Number,
	quantity: Number,
	payment: String,
	modeofdelivery: String,
	produceimg: String,
	orderdate: {
		type: Date,
	},
	status: {
		type: String,
		default: "pending",
		enum: ["pending", "complete", "cancelled"],
	},
});

module.exports = mongoose.model("Order", orderSchema);
