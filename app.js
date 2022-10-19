require("dotenv").config();
// const { log } = require("console");
const express = require("express");
const path = require("path");

// Import Routes
const aoRoutes = require("./routes/ao_routes");
const loginRoutes = require("./routes/login_routes");
const gpRoutes = require("./routes/gp_routes");
const foRoutes = require("./routes/fo_routes");
const ufRoutes = require("./routes/uf_routes");
const mongoose = require("mongoose");
const { log } = require("console");

// ====================================== Apps =====================================================
const app = express();

const PORT = process.env.PORT || 3000;

// ========================================== Mongoose ================================================

main().catch((err) => console.log(err));

async function main() {
	await mongoose.connect(process.env.DB_URI);
	log("Connected to Database");
}

// log(process.env);
// ========================================= Configurations ============================================
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// ============================================ Middleware ================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

// ======================================== Routes ====================================================

// login
app.use("/login", loginRoutes);

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
	res.send(
		`<h1 style='text-align:center;margin-top:5%;font-size:80px;'>404<h1><h1 style='text-align:center;font-size:70px;'>😂😂😂</h1><p style='text-align:center;color:red;'>Page does not exist</p>`
	);
});

// ============================================= Server ======================================================
app.listen(4000, console.log(`UFARM 🧑‍🌾🧺 available on port ${PORT}!! 😊😊`));
