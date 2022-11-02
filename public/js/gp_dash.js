// * * * * * * * * * * * * * * * * * * * * Filter * * * * * * * * * * * * * * * * * * * *

// init Isotope
const $grid = $(".collection-list").isotope({
	// options
});
// filter items on button click
$(".filter-button-group").on("click", "button", function () {
	const filterValue = $(this).attr("data-filter");
	resetFilterBtns();
	$(this).addClass("active-filter-btn");
	$grid.isotope({ filter: filterValue });
});

const filterBtns = $(".filter-button-group").find("button");
function resetFilterBtns() {
	filterBtns.each(function () {
		$(this).removeClass("active-filter-btn");
	});
}

//* * * * * * * * * * * * * * * * * * * *  Timer * * * * * * * * * * * * * * * * * * * *

// Set the date we're counting down to
const countDownDate = new Date("Nov 11, 2022 18:00:00").getTime();

// Update the count down every 1 second
const x = setInterval(function () {
	// Get today's date and time
	const now = new Date().getTime();

	// Find the distance between now and the count down date
	const distance = countDownDate - now;

	// Time calculations for days, hours, minutes and seconds
	const days = Math.floor(distance / (1000 * 60 * 60 * 24));
	const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((distance % (1000 * 60)) / 1000);

	// Output the result in an element with id="demo"
	document.getElementById("timer").innerHTML =
		days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

	// If the count down is over, write some text
	if (distance < 0) {
		clearInterval(x);
		document.getElementById("timer").innerHTML = "EXPIRED";
	}
}, 1000);
