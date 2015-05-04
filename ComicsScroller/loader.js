// console.log("loader");
var params_str=window.location.hash.substring(1);
var site=/site\/(\w*)\//.exec(params_str)[1];



// var urlRegEX_ali=/http\:\/\/manhua\.ali213\.net\/comic\/(\d*)\/(\d*)\.html/;
// var urlRegEX_8comics=/http\:\/\/new\.comicvip\.com\/show\/.*-\d*.html\?ch=\d*/;
// var urlRegEX_sf=/http\:\/\/comic\.sfacg\.com\/HTML\/\w*\/\w*\//;
// var urlRegEX_dm5=/http\:\/\/(www||tel)\.dm5\.com\/m(\d*)\//;
// var urlRegEX_manben=/http\:\/\/www\.manben\.com\/m\d*\//;

var script_echo = document.createElement("script");
script_echo.src = "../js/echo.js";
var script_comics = document.createElement("script");
script_comics.src = "../js/comics.js";
var script_main = document.createElement("script");
switch(site){
	// case "ali":
	// 	script_main.src="js/app_ali.js";
	// 	break;
	case "comics8":
		script_main.src="../js/app_8_min.js";
		// script_main.src="js/app_8.js";
		break;
	case "sf":
		script_main.src="../js/app_sf_min.js";
		// script_main.src="js/app_sf.js";
		break;
	case "dm5":
		script_main.src="../js/app_dm5_min.js";
		// script_main.src="js/app_dm5.js";
		break;
}

// (document.head||document.documentElement).appendChild(script_echo);
// (document.head||document.documentElement).appendChild(script_comics);
(document.head||document.documentElement).appendChild(script_main);

