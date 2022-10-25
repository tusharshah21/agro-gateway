const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const gpSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
});

gpSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("General", gpSchema);
