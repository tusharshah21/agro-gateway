const express = require("express");
const router = express.Router();

// customer dash
router.get("/", (req, res) => {
	res.render("gp/gp_dash");
});

// export
module.exports = router;
