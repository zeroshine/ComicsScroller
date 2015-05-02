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

    var urlRegEX_ali=/http\:\/\/www\.158c\.com(\/comic\/\d*\/\d*\.html)/;
    var urlRegEX_8comics=/http\:\/\/new\.comicvip\.com\/show\/(.*-\d*.html\?ch=\d*)/;
    var urlRegEX_sf=/http\:\/\/comic\.sfacg\.com(\/HTML\/\w*\/\w*\/.*)/;
    var urlRegEX_manben=/http\:\/\/www\.manben\.com(\/m\d*\/)/;
    var urlRegEX_dm5=/http\:\/\/(tel||www)\.dm5\.com(\/m\d*\/)/;

// tabs.on('ready',function(tab){
//     var urlRegEX_ali=/http\:\/\/www\.158c\.com(\/comic\/\d*\/\d*\.html)/;
//     var urlRegEX_8comics=/http\:\/\/new\.comicvip\.com\/show\/(.*-\d*.html\?ch=\d*)/;
//     var urlRegEX_sf=/http\:\/\/comic\.sfacg\.com(\/HTML\/\w*\/\w*\/.*)/;
//     var urlRegEX_manben=/http\:\/\/www\.manben\.com(\/m\d*\/)/;
//     var urlRegEX_dm5=/http\:\/\/(tel||www)\.dm5\.com(\/m\d*\/)/;
//     if(urlRegEX_8comics.test(tab.url)){
//         console.log("8 comics fired");
//         var chapter=urlRegEX_8comics.exec(tab.url)[1];
//         tab.url=data.url('reader.html')+"?site=8comics&chapter="+chapter;
//         // ga('send', 'event', "8comics view");
//     }else if(urlRegEX_sf.test(tab.url)){
//         console.log("sf fired");
//         var chapter=urlRegEX_sf.exec(tab.url)[1];
//         tab.url=data.url('reader.html')+"?site=8comics&chapter="+chapter;
//         // ga('send', 'event', "sf view");
//     }else if((urlRegEX_dm5.test(tab.url)||urlRegEX_manben.test(tab.url))){
//         console.log("dm5 fired");
//         var chapter=""
//         if(urlRegEX_dm5.test(tab.url)){
//             chapter=urlRegEX_dm5.exec(tab.url)[2];
//         }else{
//             chapter=urlRegEX_manben.exec(tab.url)[1];
//         }
//         tab.url=data.url('reader.html')+"?site=8comics&chapter="+chapter;
//         // ga('send', 'event', "dm5 view");
//     }

// });


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
