require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const moment = require("moment");
const flash = require("connect-flash");

// * Import Schema
const User = require("./models/Users");

//* Import Routes
const aoRoutes = require("./routes/ao_routes");
const authRoutes = require("./routes/auth_routes");
const gpRoutes = require("./routes/gp_routes");
const foRoutes = require("./routes/fo_routes");
const ufRoutes = require("./routes/uf_routes");

//* ====================================== Apps =====================================================
const app = express();

//* ========================================== Mongoose ================================================
const PORT = process.env.PORT || 3000;

main().catch((err) => console.log(err));
async function main() {
	await mongoose.connect(process.env.DB_URI);
	console.log("Connected to Database " + process.env.DB_URI);
}

//* ========================================= Configurations ============================================
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.locals.moment = moment;

//* ============================================ Middleware ================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(flash());

// * Passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//* ======================================== Routes ====================================================

// login
app.use("/login", authRoutes);

// AO routes
app.use("/ao", aoRoutes);

// FO routes
app.use("/fo", foRoutes);

// UF routes
app.use("/uf", ufRoutes);

// GP routes
app.use("/", gpRoutes);

// 404 routing
app.get("*", (req, res) => {
	// res.send(
	// 	`<h1 style='text-align:center;margin-top:5%;font-size:80px;'>404<h1><h1 style='text-align:center;font-size:70px;'>😂😂😂</h1><p style='text-align:center;color:red;'>Page does not exist</p>`
	// );
	res.render("404.pug");
});

//* ============================================= Server ======================================================
app.listen(PORT, console.log(`Agro-Indi🧑‍🌾🧺 available on port ${PORT}!! 😊😊`));
