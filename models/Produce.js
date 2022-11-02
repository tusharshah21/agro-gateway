const mongoose = require("mongoose");

const produceSchema = new mongoose.Schema({
	uploadedby: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true,
	},
	fullname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phonenumber: {
		type: String,
		required: true,
	},
	ward: {
		type: String,
		required: true,
	},
	producetype: {
		type: String,
		required: true,
	},
	producename: {
		type: String,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	modeofdelivery: {
		type: String,
		required: true,
	},
	payment: {
		type: Array,
		required: true,
	},
	organic: {
		type: String,
		required: true,
	},
	produceimg: {
		type: String,
		required: true,
	},
	uploaddate: {
		type: String,
		required: true,
	},
	availability: {
		type: String,
		default: "available",
		enum: ["available", "booked", "N/A"],
	},
	status: {
		type: String,
		default: "pending",
		enum: ["pending", "approved"],
	},
});

module.exports = mongoose.model("Produce", produceSchema);
