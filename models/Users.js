const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	firstname: {
		type: String,
		required: true,
		trim: true,
	},
	lastname: {
		type: String,
		required: true,
		trim: true,
	},
	uniquenumber: {
		type: String,
		required: true,
		unique: true,
	},
	dob: {
		type: String,
		required: true,
	},
	gender: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	phonenumber: {
		type: String,
		required: true,
		trim: true,
	},
	nin: {
		type: String,
		required: true,
		trim: true,
	},
	role: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
		trim: true,
	},
	ward: {
		type: String,
		// required: true,
	},
	residencetime: {
		type: String,
		// required: true,
	},
	residencetype: {
		type: String,
		// required: true,
	},
	// activity: {
	// 	type: String,
	// 	// required: true,
	// },
	registrationdate: {
		type: Date,
		required: true,
		// default: Date(),
	},
	avatar: {
		type: String,
	},
	status: {
		type: String,
		default: "active",
		enum: ["active", "retired"],
	},
});

userSchema.plugin(passportLocalMongoose, { usernameField: "uniquenumber" });

module.exports = mongoose.model("User", userSchema);
