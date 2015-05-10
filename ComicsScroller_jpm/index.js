var Comics_sf=require('../../src/app/comics_sf.js');
var Comics_8=require('../../src/app/comics_8.js');
var Comics_dm5=require('../../src/app/comics_dm5.js');

var ss=require("sdk/simple-storage");
var tabs=require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require('sdk/self');
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

if (!ss.storage.readed){
  ss.storage.readed = [];
}
if (!ss.storage.collected){
  ss.storage.collected = [];
}
if (!ss.storage.collected){
  ss.storage.collected = [];
}


tabs.on('ready',function(tab){
    // var urlRegEX_8comics=/http\:\/\/new\.comicvip\.com\/show\/(.*-\d*.html\?ch=\d*)/;
    // var urlRegEX_sf=/http\:\/\/comic\.sfacg\.com(\/HTML\/\w*\/\w*\/.*)/;
    // var urlRegEX_manben=/http\:\/\/www\.manben\.com(\/m\d*\/)/;
    // var urlRegEX_dm5=/http\:\/\/(tel||www)\.dm5\.com(\/m\d*\/)/;
    if(urlRegEX_8comics.test(tab.url)){
        console.log("8 comics fired");
        var chapter=Comics_8.regex.exec(tab.url)[1];;
        tab.url=data.url('reader.html')+"#/site/comics8/chapter/"+chapter;
        // ga('send', 'event', "8comics view");
    }else if(urlRegEX_sf.test(tab.url)){
        console.log("sf fired");
        var chapter=Comics_sf.exec(tab.url)[1];
        tab.url=data.url('reader.html')+"#/site/sf/chapter/"+chapter;
        // ga('send', 'event', "sf view");
    }else if((urlRegEX_dm5.test(tab.url)||urlRegEX_manben.test(tab.url))){
        console.log("dm5 fired");
        var chapter=""
        if(urlRegEX_dm5.test(tab.url)){
            chapter=urlRegEX_dm5.exec(tab.url)[2];
        }else{
            chapter=urlRegEX_manben.exec(tab.url)[1];
        }
        tab.url=data.url('reader.html')+"#/site/comics8/chapter/"+chapter;
        // ga('send', 'event', "dm5 view");
    }

});




// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;
