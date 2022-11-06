function genUfUniqueNum() {
	let chars = "0123456789";
	let charLength = 3;
	let uniquenumber = "UF-";
	for (var i = 0; i <= charLength; i++) {
		var randomNumber = Math.floor(Math.random() * chars.length);
		uniquenumber += chars.substring(randomNumber, randomNumber + 1);
	}
	document.getElementById("uniquenumber").value = uniquenumber;
}

// tooltip
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(
	(tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);
