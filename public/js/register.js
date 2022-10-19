// const uniquenumber = document.getElementById("uniquenumber");

function genPassword() {
	let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let charLength = 8;
	let uniquenumber = "";
	for (var i = 0; i <= charLength; i++) {
		var randomNumber = Math.floor(Math.random() * chars.length);
		uniquenumber += chars.substring(randomNumber, randomNumber + 1);
	}
	document.getElementById("uniquenumber").value = uniquenumber;
}

// function copyPassword() {
// 	var copyText = document.getElementById("password");
// 	copyText.select();
// 	document.execCommand("copy");
// }
