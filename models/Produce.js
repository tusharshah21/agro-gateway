const mongoose = require("mongoose");

const produceSchema = new mongoose.Schema({
	fullname: String,
	ward: String,
	producetype: String,
	producename: String,
	quantity: Number,
	price: Number,
	modeofdelivery: String,
	payment: Array,
	organic: String,
	produceimg: String,
	uploaddate: {
		type: String,
		default: Date.now(),
	},
});

module.exports = mongoose.model("Produce", produceSchema);
