(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://ssl.google-analytics.com/analytics.js','ga');
ga('create', 'UA-59728771-1', 'auto');
ga('set','checkProtocolTask', null);
ga('send', 'pageview');

var comics=comics || { };
var addIcon = function(tabId,changeInfo,tab){
	console.log("fired");
	var urlRegEX_ali=/http\:\/\/www\.158c\.com(\/comic\/\d*\/\d*\.html)/;
	var urlRegEX_8comics=/http\:\/\/new\.comicvip\.com\/show\/(.*-\d*.html\?ch=\d*)/;
	var urlRegEX_sf=/http\:\/\/comic\.sfacg\.com(\/HTML\/\w*\/\w*\/.*)/;
	var urlRegEX_manben=/http\:\/\/www\.manben\.com(\/m\d*\/)/;
	var urlRegEX_dm5=/http\:\/\/(tel||www)\.dm5\.com(\/m\d*\/)/;
	// if(urlRegEX_ali.test(tab.url)){
		// console.log("ali fired");
		// var chapter=urlRegEX_ali.exec(tab.url)[1];
		// chrome.tabs.update(tab.id,{url: chrome.extension.getURL("reader.html")+"?site=ali&chapter="+chapter});
		// chrome.pageAction.show(tabId);
		// chrome.tabs.executeScript(null,{file:"js/echo.js",runAt:"document_start"});
		// chrome.tabs.executeScript(null,{file:"js/comics.js",runAt:"document_start"});
		// chrome.tabs.executeScript(null,{file:"js/comics_ali.js",runAt:"document_start"});
		// chrome.tabs.insertCSS(null,{file:"css/comics.css",runAt:"document_start"});
		// ga('send', 'event', "ali view");
	if(urlRegEX_8comics.test(tab.url)){
		console.log("8 comics fired");
		var chapter=urlRegEX_8comics.exec(tab.url)[1];
		chrome.tabs.update(tab.id,{url: chrome.extension.getURL("reader.html")+"?site=8comics&chapter="+chapter});
		// chrome.pageAction.show(tabId);
		// chrome.tabs.executeScript(null,{file:"js/echo.js",runAt:"document_start"});
		// chrome.tabs.executeScript(null,{file:"js/comics.js",runAt:"document_start"});
		// chrome.tabs.executeScript(null,{file:"js/comics_8.js",runAt:"document_start"});
		// chrome.tabs.insertCSS(null,{file:"css/comics.css",runAt:"document_start"});
		ga('send', 'event', "8comics view");
	}else if(urlRegEX_sf.test(tab.url)){
		console.log("sf fired");
		var chapter=urlRegEX_sf.exec(tab.url)[1];
		chrome.tabs.update(tab.id,{url: chrome.extension.getURL("reader.html")+"?site=sf&chapter="+chapter});
		// chrome.pageAction.show(tabId);
		// chrome.tabs.executeScript(null,{file:"js/echo.js",runAt:"document_start"});
		// chrome.tabs.executeScript(null,{file:"js/comics.js",runAt:"document_start"});
		// chrome.tabs.executeScript(null,{file:"js/comics_sf.js",runAt:"document_start"});
		// chrome.tabs.insertCSS(null,{file:"css/comics.css",runAt:"document_start"});
		ga('send', 'event', "sf view");
	}else if((urlRegEX_dm5.test(tab.url)||urlRegEX_manben.test(tab.url))){
		console.log("dm5 fired");
		var chapter=""
		if(urlRegEX_dm5.test(tab.url)){
			chapter=urlRegEX_dm5.exec(tab.url)[2];
		}else{
			chapter=urlRegEX_manben.exec(tab.url)[1];
		}
		chrome.tabs.update(tab.id,{url: chrome.extension.getURL("reader.html")+"?site=dm5&chapter="+chapter});
		// chrome.pageAction.show(tabId);
		// chrome.tabs.executeScript(null,{file:"js/echo.js",runAt:"document_start"});
		// chrome.tabs.executeScript(null,{file:"js/comics.js",runAt:"document_start"});
		// chrome.tabs.executeScript(null,{file:"js/comics_dm5.js",runAt:"document_start"});
		// chrome.tabs.insertCSS(null,{file:"css/comics.css",runAt:"document_start"});
		ga('send', 'event', "dm5 view");
	}
};
chrome.tabs.onUpdated.addListener(addIcon);

  