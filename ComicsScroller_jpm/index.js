var self = require('sdk/self');
var tabs = require("sdk/tabs");
var data = self.data;
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


var urlRegEX_8comics=/http\:\/\/new\.comicvip\.com\/show\/(.*-\d*.html\?ch=\d*)/;
var urlRegEX_sf=/http\:\/\/comic\.sfacg\.com\/(HTML\/[^\/]+\/.+)$/;
var urlRegEX_manben=/http\:\/\/www\.manben\.com\/(m\d*\/)/;
var urlRegEX_dm5=/http\:\/\/(tel||www)\.dm5\.com\/(m\d*\/)/;

tabs.on('ready',function(tab){
	if(urlRegEX_8comics.test(tab.url)){
		var chapter=urlRegEX_8comics.exec(tab.url)[1];
		tab.url=data.url('reader.html')+'#/site/comics8/chapter/'+chapter;
	}else if(urlRegEX_sf.test(tab.url)){
		var chapter=urlRegEX_sf.exec(tab.url)[1];
		tab.url=data.url('reader.html')+'#/site/sf/chapter/'+chapter;
	}else if(urlRegEX_manben.test(tab.url)||urlRegEX_dm5.test(tab.url)){
		// console.log("dm5 fired");
		var chapter=""
		if(urlRegEX_dm5.test(tab.url)){
			chapter=urlRegEX_dm5.exec(tab.url)[2];
		}else{
			chapter=urlRegEX_manben.exec(tab.url)[1];
		}
		tab.url=data.url('reader.html')+'#/site/dm5/chapter/'+chapter;
	}
});


// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;
