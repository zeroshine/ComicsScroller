var tabs=require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
var { ActionButton } = require("sdk/ui/button/action");
var button = ActionButton({
    id: "Comics_Scroller",
    label: "Comics Scroller",
    icon: {
      "16": "./comics-16.png",
      "48": "./comics-48.png",
      "64": "./comics-64.png"
    }
});

var urlRegEX_ali=/http\:\/\/manhua\.ali213\.net\/comic\/(\d*)\/(\d*)\.html/;
var urlRegEX_8comics=/http\:\/\/new\.comicvip\.com\/show\/.*-\d*.html\?ch=\d*/;
var urlRegEX_sf=/http\:\/\/comic\.sfacg\.com\/HTML\/\w*\/\w*\//;
var urlRegEX_dm5=/http\:\/\/(www||tel)\.dm5\.com\/m(\d*)\//;
var urlRegEX_manben=/http\:\/\/www\.manben\.com\/m\d*\//;

pageMod.PageMod({
    include: [urlRegEX_8comics,urlRegEX_ali,urlRegEX_dm5,urlRegEX_sf,urlRegEX_manben],
    contentScriptWhen: "start",
    contentScriptFile: ["./loader.js"],
	  contentStyleFile: ["./comics.css"],
	  contentScriptOptions: {
    	echo: data.url("echo.js"),
    	comics: data.url("comics.js"),
    	ali: data.url("comics_ali.js"),
    	comics8: data.url("comics_8.js"),
    	sf:data.url("comics_sf.js"),
    	dm5:data.url("comics_dm5.js")
	  }
});
