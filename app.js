const express = require("express");
const path = require("path");

// Apps
const app = express();

// Configurations
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/public/images", express.static(__dirname + "/public/images"));

// Routes
app.get("/login", (req, res) => {
	res.render("login");
});

// 404 routing
app.get("*", (req, res) => {
	res.send(
		"<h1 style='text-align:center;margin-top:10%;font-size:100px;'>404<h1><h1 style='text-align:center;font-size:100px;'>😂😂😂<h1><p style='text-align:center'>Page does not exist</p>"
	);
});

// Server
app.listen(3000, console.log("Listening on port 3000!!"));
