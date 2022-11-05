const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	seller: String,
	customer: String,

	producename: String,

	quantity: Number,
	payment: String,
	modeofdelivery: String,
	produceimg: String,
	orderdate: {
		type: Date,
		default: new Date(),
	},
});

module.exports = mongoose.model("Order", orderSchema);
