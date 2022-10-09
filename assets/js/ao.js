(function () {
	"use strict";

	if (select(".search-bar-toggle")) {
		on("click", ".search-bar-toggle", function (e) {
			select(".search-bar").classList.toggle("search-bar-show");
		});
	}
	if (select(".toggle-sidebar-btn")) {
		on("click", ".toggle-sidebar-btn", function (e) {
			select("body").classList.toggle("toggle-sidebar");
		});
	}
})();
