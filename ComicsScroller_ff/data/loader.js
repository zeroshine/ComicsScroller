// console.log("loader");
var urlRegEX_ali=/http\:\/\/manhua\.ali213\.net\/comic\/(\d*)\/(\d*)\.html/;
var urlRegEX_8comics=/http\:\/\/new\.comicvip\.com\/show\/.*-\d*.html\?ch=\d*/;
var urlRegEX_sf=/http\:\/\/comic\.sfacg\.com\/HTML\/\w*\/\w*\//;
var urlRegEX_dm5=/http\:\/\/(www||tel)\.dm5\.com\/m(\d*)\//;
var urlRegEX_manben=/http\:\/\/www\.manben\.com\/m\d*\//;

var script_echo = document.createElement("script");
script_echo.src = self.options.echo;
var script_comics = document.createElement("script");
script_comics.src = self.options.comics;
var script_main = document.createElement("script");
if(urlRegEX_ali.test(document.URL)){
	script_main.src=self.options.ali;
}else if(urlRegEX_8comics.test(document.URL)){
	console.log(self.options.comics8);
	script_main.src=self.options.comics8;
	script_main.charset="utf-8";
	script_comics.charset="utf-8";
}else if(urlRegEX_sf.test(document.URL)){
	script_main.src=self.options.sf;
}else if(urlRegEX_dm5.test(document.URL)||urlRegEX_manben.test(document.URL)){
	script_main.src=self.options.dm5;
}

(document.head||document.documentElement).appendChild(script_echo);
(document.head||document.documentElement).appendChild(script_comics);
(document.head||document.documentElement).appendChild(script_main);

