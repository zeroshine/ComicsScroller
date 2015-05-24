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

pageMod.PageMod({
    include: "http://zeroshine.github.io/ComicsScroller/*",
    contentScriptWhen: "ready",
    contentScriptFile: ["./app_min.js"],
    contentStyleFile: ["./app_min.css"]
});


var urlRegEX_8comics=/http\:\/\/new\.comicvip\.com\/show\/(.*-\d*.html\?ch=\d*)/;
var urlRegEX_sf=/http\:\/\/comic\.sfacg\.com\/(HTML\/[^\/]+\/.+)$/;
var urlRegEX_manben=/http\:\/\/www\.manben\.com\/(m\d*\/)/;
var urlRegEX_dm5=/http\:\/\/(tel||www)\.dm5\.com\/(m\d*\/)/;
var url=data.url('reader.html').slice(0,-16);

tabs.on('ready',function(tab){
    if(urlRegEX_8comics.test(tab.url)){
        var chapter=urlRegEX_8comics.exec(tab.url)[1];
        tab.url="http://zeroshine.github.io/ComicsScroller/reader.html#/site/comics8/chapter/"+chapter;
    }else if(urlRegEX_sf.test(tab.url)){
        var chapter=urlRegEX_sf.exec(tab.url)[1];
        tab.url="http://zeroshine.github.io/ComicsScroller/reader.html#/site/sf/chapter/"+chapter;
    }else if(urlRegEX_manben.test(tab.url)||urlRegEX_dm5.test(tab.url)){
        // console.log("dm5 fired");
        var chapter=""
        if(urlRegEX_dm5.test(tab.url)){
            chapter=urlRegEX_dm5.exec(tab.url)[2];
        }else{
            chapter=urlRegEX_manben.exec(tab.url)[1];
        }
        tab.url="http://zeroshine.github.io/ComicsScroller/reader.html#/site/dm5/chapter/"+chapter;
    }
});


// const {Cc,Ci} = require("chrome");
// const etldService = Cc['@mozilla.org/network/effective-tld-service;1']
//                            .getService(Ci.nsIEffectiveTLDService);
// var httpRequestObserver =
// {
//   observe: function(subject, topic, data) 
//   {
//     if (topic == "http-on-modify-request") {
//       var channel = subject.QueryInterface(Ci.nsIHttpChannel);
//       var url=channel.URI.spec;
//       if(urlRegEX_dm5.test(url)||urlRegEX_manben.test(url)){
//         var ref=etldService.getBaseDomain(uri)
//         channel.setRequestHeader("Referer", "http://www.manben.com", false);
//         channel.setRequestHeader("Cookie", "isAdult=1", false);
//       }
//       // httpChannel.setRequestHeader("X-Hello", "World", false);
//     }
//   }
// };

// var observerService = Cc["@mozilla.org/observer-service;1"]
//                                 .getService(Ci.nsIObserverService);
// observerService.addObserver(httpRequestObserver, "http-on-modify-request", false);

var events = require("sdk/system/events");
var { Cc,Ci } = require("chrome");
// Cu.import("resource://gre/modules/Services.jsm");

function listener(event) {
    var channel = event.subject.QueryInterface(Ci.nsIHttpChannel);    
    var url=channel.URI.spec;
    if(/www\.manben\.com\//.test(url)||/http:\/\/manhua\d+\..*/.test(url)){
        // var channel = event.subject.QueryInterface(Ci.nsIHttpChannel);
        console.log('channel referrer',channel.referrer);
        console.log('change header',url);    
        // channel.setRequestHeader("User-Agent", "MyBrowser/1.0", false);
        // channel.referrer='http://www.manben.com';
        channel.setRequestHeader("Referer", "http://www.manben.com", false);
        channel.setRequestHeader("Cookie", "isAdult=1", false);
        // if (channel.referrer) channel.referrer.spec ='http://www.manben.com';
        
    }
}

events.on("http-on-modify-request", listener);
    // var urlRegEX_ali=/http\:\/\/www\.158c\.com(\/comic\/\d*\/\d*\.html)/;
    // var urlRegEX_8comics=/http\:\/\/new\.comicvip\.com\/show\/(.*-\d*.html\?ch=\d*)/;
    // var urlRegEX_sf=/http\:\/\/comic\.sfacg\.com(\/HTML\/\w*\/\w*\/.*)/;
    // var urlRegEX_manben=/http\:\/\/www\.manben\.com(\/m\d*\/)/;
    // var urlRegEX_dm5=/http\:\/\/(tel||www)\.dm5\.com(\/m\d*\/)/;

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


// pageMod.PageMod({
//     include: [urlRegEX_8comics,urlRegEX_ali,urlRegEX_dm5,urlRegEX_sf,urlRegEX_manben],
//     contentScriptWhen: "start",
//     contentScriptFile: ["./loader.js"],
// 	  contentStyleFile: ["./comics.css"],
// 	  contentScriptOptions: {
//     	echo: data.url("echo.js"),
//     	comics: data.url("comics.js"),
//     	ali: data.url("comics_ali.js"),
//     	comics8: data.url("comics_8.js"),
//     	sf:data.url("comics_sf.js"),
//     	dm5:data.url("comics_dm5.js")
// 	  }
// });
