const express = require("express");
const path = require("path");
const aoRoutes = require("./routes/ao_routes");
const loginRoutes = require("./routes/login_routes");
const gpRoutes = require("./routes/gp_routes");

// ====================================== Apps =====================================================
const app = express();

// ========================================= Configurations ============================================
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// ============================================ Middleware ================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/public/images", express.static(__dirname + "/public/images"));

// ======================================== Routes ====================================================

// login
app.use("/login", loginRoutes);

// AO routes
app.use("/ao", aoRoutes);

// GP routes
app.use("/", gpRoutes);

// 404 routing
app.get("*", (req, res) => {
	res.send(
		`<h1 style='text-align:center;margin-top:5%;font-size:80px;'>404<h1><h1 style='text-align:center;font-size:70px;'>😂😂😂</h1><p style='text-align:center;color:red;'>Page does not exist</p>`
	);
});

// ============================================= Server ======================================================
app.listen(4000, console.log("UFARM 🧑‍🌾🧺 available on port 4000!! 😊😊"));
