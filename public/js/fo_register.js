function genFoUniqueNum() {
	let chars = "0123456789";
	let charLength = 3;
	let uniquenumber = "FO-";
	for (var i = 0; i <= charLength; i++) {
		var randomNumber = Math.floor(Math.random() * chars.length);
		uniquenumber += chars.substring(randomNumber, randomNumber + 1);
	}
	document.getElementById("uniquenumber").value = uniquenumber;
}
