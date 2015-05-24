// var ObjectAssign=require('object-assign');
// require("babel/polyfill");
var Comics_sf=require('./app/comics_sf.js');
var Comics_8=require('./app/comics_8.js');
var Comics_dm5=require('./app/comics_dm5.js');


// var redirectLocal = function(tabId,changeInfo,tab){
// 	if(Comics_8.regex.test(tab.url)&&changeInfo.status==='loading'){
// 		console.log("8 comics fired");
// 		var chapter=Comics_8.regex.exec(tab.url)[1];
// 		chrome.tabs.update(tab.id,{url: chrome.extension.getURL("reader.html")+"#/site/comics8/chapter/"+chapter});
// 		ga('send', 'event', "8comics view");
// 	}else if(Comics_sf.regex.test(tab.url)&&changeInfo.status==='loading'){
// 		console.log("sf fired");
// 		var chapter=Comics_sf.regex.exec(tab.url)[1];
// 		chrome.tabs.update(tab.id,{url: chrome.extension.getURL("reader.html")+"#/site/sf/chapter/"+chapter});
// 		ga('send', 'event', "sf view");
// 	}else if((Comics_dm5.regex.test(tab.url)||Comics_dm5.dm5regex.test(tab.url))&&changeInfo.status==='loading'){
// 		console.log("dm5 fired");
// 		var chapter=""
// 		if(Comics_dm5.dm5regex.test(tab.url)){
// 			chapter=Comics_dm5.dm5regex.exec(tab.url)[2];
// 		}else{
// 			chapter=Comics_dm5.regex.exec(tab.url)[1];
// 		}
// 		chrome.tabs.update(tab.id,{url: chrome.extension.getURL("reader.html")+"#/site/dm5/chapter/"+chapter});
// 		ga('send', 'event', "dm5 view");
// 	}
// };


// chrome.notifications.onClicked.addListener(function(id){
// 	chrome.tabs.create({url:id});
// });

var comicsQuery = function(){
	// chrome.notifications.create("test",{
	// 	type:"basic",
	// 	iconUrl:'img/comics-64.png',
	// 	title:"Comics Update",
	// 	message:"test"
	// });
	chrome.storage.local.get('collected',function(items){
      for(var k=0;k<items.collected.length;++k){
      	var indexURL=items.collected[k].url;
      	var chapters=items.collected[k].menuItems;
      	var req=new XMLHttpRequest();
	    req.open('GET',indexURL);
	    req.responseType="document";
	    if(items.collected[k].site==='sf'){
	    	req.onload=(function(indexURL,chapters,req,items,k,Comics_sf){
	      		return function(){
	      			Comics_sf.backgroundOnload(indexURL, chapters, req, items, k);
	      		}      		
			})(indexURL,chapters,req,items,k,Comics_sf);
	    }else if(items.collected[k].site==='comics8'){
	    	req.onload=(function(indexURL,chapters,req,items,k,Comics_8){
	      		return function(){
	      			Comics_8.backgroundOnload(indexURL, chapters, req, items, k);
	      		}      		
			})(indexURL,chapters,req,items,k,Comics_8);
	    }else if(items.collected[k].site==='dm5'){
	    	req.onload=(function(indexURL,chapters,req,items,k,Comics_dm5){
	      		return function(){
	      			Comics_dm5.backgroundOnload(indexURL, chapters, req, items, k);
	      		}      		
			})(indexURL,chapters,req,items,k,Comics_dm5);
	    }
	    req.send();
	  }
	});
}


chrome.runtime.onInstalled.addListener(function(){
	var collected={
		collected:[]		
	};

	var readed={
		readed:[]
	};

	var update={
		update:[]
	};
	chrome.storage.local.get('readed',function(items){
	  var readedItem = Object.assign(readed,items);
	  chrome.storage.local.set(readedItem);
	});

	chrome.storage.local.get('update',function(items){
	  var updateItem = Object.assign(update,items);
	  chrome.storage.local.set(updateItem);
	});

	chrome.storage.local.get('collected',function(items){
	  var collectedItem = Object.assign(collected,items);
	  chrome.storage.local.set(collectedItem);
	});

	chrome.alarms.create("comicsQuery", {
       periodInMinutes: 1});
});

// chrome.tabs.onUpdated.addListener(redirectLocal);
// chrome.webNavigation.onCommitted.addListener
chrome.webNavigation.onCommitted.addListener(function(details) {
	if(Comics_8.regex.test(details.url)){
		console.log("8 comics fired");
		var chapter=Comics_8.regex.exec(details.url)[1];
		chrome.tabs.update(details.tabId,{url: chrome.extension.getURL("reader.html")+"#/site/comics8/chapter/"+chapter});
		ga('send', 'event', "8comics view");
	}else if(Comics_sf.regex.test(details.url)){
		console.log("sf fired");
		var chapter=Comics_sf.regex.exec(details.url)[1];
		chrome.tabs.update(details.tabId,{url: chrome.extension.getURL("reader.html")+"#/site/sf/chapter/"+chapter});
		ga('send', 'event', "sf view");
	}else if((Comics_dm5.regex.test(details.url)||Comics_dm5.dm5regex.test(details.url))){
		console.log("dm5 fired");
		var chapter=""
		if(Comics_dm5.dm5regex.test(details.url)){
			chapter=Comics_dm5.dm5regex.exec(details.url)[2];
		}else{
			chapter=Comics_dm5.regex.exec(details.url)[1];
		}
		chrome.tabs.update(details.tabId,{url: chrome.extension.getURL("reader.html")+"#/site/dm5/chapter/"+chapter});
		ga('send', 'event', "dm5 view");
	}
},{url:[
	{urlMatches: "http://new\.comicvip\.com/show/\w*"},
		{urlMatches: "http://www\.manben\.com/m\d*"},
		{urlMatches: "comic\.sfacg\.com\/HTML\/[^\/]+\/.+$"},
		{urlMatches: "http://(tel||www)\.dm5\.com/m\d*"}
		]
	});

chrome.alarms.onAlarm.addListener(function(alarm){
	comicsQuery();
});
// chrome.storage.local.get('readed',function(items){
//   var readedItem = Object.assign(readed,items);
//   chrome.storage.local.set(readedItem);
// });

// chrome.storage.local.get('update',function(items){
//   var updateItem = Object.assign(update,items);
//   chrome.storage.local.set(updateItem);
// });

// chrome.storage.local.get('collected',function(items){
//   var collectedItem = Object.assign(collected,items);
//   // console.log(collectedItem);
//   chrome.storage.local.set(collectedItem,function(){
//   	// comicsQuery();
//   	setInterval(function(){comicsQuery();},60000);
//   });
// });


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.alocal=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://ssl.google-analytics.com/analytics.js','ga');
ga('create', 'UA-59728771-1', 'auto');
ga('set','checkProtocolTask', null);
ga('send', 'pageview');
  