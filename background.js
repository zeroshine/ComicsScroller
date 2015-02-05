var comics=comics || { };
var addIcon = function(tabId,changeInfo,tab){
	var urlRegEX=/http:\/\/manhua\.ali213\.net\/comic\/(\d*)\/(\d*)\.html/;
	if(urlRegEX.test(tab.url)){
		chrome.pageAction.show(tabId);
		
		// console.log("Icon init");
	}else{
		// console.log(tab.url+" icon loading failed");
	}	
};
chrome.tabs.onUpdated.addListener(addIcon);
