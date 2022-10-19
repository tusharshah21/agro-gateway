const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	firstname: {
		type: String,
	},
	lastname: String,
	uniquenumber: String,
	dob: String,
	gender: String,
	email: String,
	phonenumber: String,
	nin: String,
	role: String,
	address: String,
	ward: String,
	residencetime: String,
	residencetype: String,
	activity: String,
	registrationdate: String,
});

userSchema.plugin(passportLocalMongoose, {
	usernameField: "uniquenumber",
});

module.exports = mongoose.model("User", userSchema);
