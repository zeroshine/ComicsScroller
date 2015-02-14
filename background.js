var comics=comics || { };
var addIcon = function(tabId,changeInfo,tab){
	var urlRegEX_ali=/http\:\/\/manhua\.ali213\.net\/comic\/(\d*)\/(\d*)\.html/;
	var urlRegEX_8comics=/http\:\/\/new\.comicvip\.com\/show\/.*-\d*.html\?ch=\d*/;
	var urlRegEX_sf=/http\:\/\/comic\.sfacg\.com\/HTML\/\w*\/\w*\//;
	var urlRegEX_dm5=/http\:\/\/tel\.dm5\.com\/m(\d*)\//;
	if(urlRegEX_ali.test(tab.url)){
		chrome.pageAction.show(tabId);
		chrome.tabs.executeScript(null,{file:"echo.js",runAt:"document_start"});
		chrome.tabs.executeScript(null,{file:"comics.js",runAt:"document_start"});
		chrome.tabs.executeScript(null,{file:"comics_ali.js",runAt:"document_start"});
		chrome.tabs.insertCSS(null,{file:"comics.css",runAt:"document_start"});
	}else if(urlRegEX_8comics.test(tab.url)){
		chrome.pageAction.show(tabId);
		chrome.tabs.executeScript(null,{file:"echo.js",runAt:"document_start"});
		chrome.tabs.executeScript(null,{file:"comics.js",runAt:"document_start"});
		chrome.tabs.executeScript(null,{file:"comics_8.js",runAt:"document_start"});
		chrome.tabs.insertCSS(null,{file:"comics.css",runAt:"document_start"});
	}else if(urlRegEX_sf.test(tab.url)){
		chrome.pageAction.show(tabId);
		chrome.tabs.executeScript(null,{file:"echo.js",runAt:"document_start"});
		chrome.tabs.executeScript(null,{file:"comics.js",runAt:"document_start"});
		chrome.tabs.executeScript(null,{file:"comics_sf.js",runAt:"document_start"});
		chrome.tabs.insertCSS(null,{file:"comics.css",runAt:"document_start"});
	}else if(urlRegEX_dm5.test(tab.url)){
		chrome.pageAction.show(tabId);
		chrome.tabs.executeScript(null,{file:"echo.js",runAt:"document_start"});
		chrome.tabs.executeScript(null,{file:"comics.js",runAt:"document_start"});
		chrome.tabs.executeScript(null,{file:"comics_dm5.js",runAt:"document_start"});
		chrome.tabs.insertCSS(null,{file:"comics.css",runAt:"document_start"});
	}
};
chrome.tabs.onUpdated.addListener(addIcon);
