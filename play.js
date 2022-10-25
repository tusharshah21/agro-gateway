router.get("/reports", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	req.session.user = req.user;
	if (req.user.role == "AgricOfficer") {
		try {
			let totalPoultry = await Produce.aggregate([
				{ $match: { prodcategory: "poultry" } },
				{
					$group: {
						_id: "$prodname",
						totalQuantity: { $sum: "$quantity" },
						totalCost: { $sum: { $multiply: ["$unitprice", "$quantity"] } },
					},
				},
			]);

			let totalHort = await Produce.aggregate([
				{ $match: { prodcategory: "horticultureproduce" } },
				{
					$group: {
						_id: "$all",
						totalQuantity: { $sum: "$quantity" },
						totalCost: { $sum: { $multiply: ["$unitprice", "$quantity"] } },
					},
				},
			]);
			let totalDairy = await Produce.aggregate([
				{ $match: { prodcategory: "dairyproducts" } },
				{
					$group: {
						_id: "$all",
						totalQuantity: { $sum: "$quantity" },
						totalCost: { $sum: { $multiply: ["$unitprice", "$quantity"] } },
					},
				},
			]);

			console.log("Poultry collections", totalPoultry);
			console.log("Hort collections", totalHort);
			console.log("Dairy collections", totalDairy);

			res.render("reports", {
				title: "Reports",
				totalP: totalPoultry[0],
				totalH: totalHort[0],
				totalD: totalDairy[0],
			});
		} catch (error) {
			res.status(400).send("unable to find items in the database");
		}
	} else {
		res.send("This page is only accessed by Agric Officers");
	}
});

const value = "Urban Farmer";
const str = value
	.split(" ")
	.map((word) => word[0])
	.join("");

console.log(str);
