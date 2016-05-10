let Comics_sf=require('./app/comics_sf.js');
let Comics_8=require('./app/comics_8.js');
let Comics_dm5=require('./app/comics_dm5.js');
console.log('background');
let chapterfunhandler = function(details) {
  // console.log("chapterfunhandler"+details.url);
  // let isRefererSet = false;
    // headers = details.requestHeaders;
  details.requestHeaders.push({	    
    name: "Referer",
    value: "http://www.dm5.com/"
  });
  return {requestHeaders:details.requestHeaders};
};

let mhandler = function(details) {
  // console.log('handler');
  // console.log("mhandler"+details.url);
  // let headers = details.requestHeaders;
    // setcookie = false;
  for(let i=0 ; i < details.requestHeaders.length ; ++i){
  	if(details.requestHeaders[i].name === "Cookie"){
  		details.requestHeaders[i].value += ";isAdult=1";
  		break;
  	}
  }
  return {requestHeaders:details.requestHeaders};
};


let sfhandler = function(details) {
  console.log('sfhandler');
  details.requestHeaders.push({     
    name: "Referer",
    value: "http://comic.sfacg.com/HTML/"
  });
  return {requestHeaders:details.requestHeaders};
} 

chrome.webRequest.onBeforeSendHeaders.addListener(chapterfunhandler, 
	{urls: ["http://www.dm5.com/m*/chapterfun*"]},
	['requestHeaders', 'blocking']);

chrome.webRequest.onBeforeSendHeaders.addListener(mhandler, 
	{urls: ["http://www.dm5.com/m*/"]},
	['requestHeaders', 'blocking']);

chrome.webRequest.onBeforeSendHeaders.addListener(sfhandler, 
  {urls: ["http://*.sfacg.com/*"]},
  ['requestHeaders', 'blocking']);

chrome.notifications.onClicked.addListener(function(id){
	chrome.tabs.create({url:id});
});

let comicsQuery = function(){
	chrome.storage.local.get('collected',function(items){
      for(let k=0;k<items.collected.length;++k){
      	let indexURL=items.collected[k].url;
      	let chapters=items.collected[k].menuItems;
      	// console.log('chapters',chapters.length,chapters[0].payload);
      	let req=new XMLHttpRequest();
	    if(items.collected[k].site==='sf'){
		    req.open('GET',indexURL);
		    req.responseType="document";
	    	req.onload=(function(indexURL,chapters,req,items,k,Comics_sf){
	      		return function(){
	      			Comics_sf.backgroundOnload(indexURL, chapters, req, items, k);
	      		}      		
			})(indexURL,chapters,req,items,k,Comics_sf);
	    }else if(items.collected[k].site==='comics8'){
		    req.open('GET',indexURL);
	    	req.responseType="document";
	    	req.onload=(function(indexURL,chapters,req,items,k,Comics_8){
	      		return function(){
	      			Comics_8.backgroundOnload(indexURL, chapters, req, items, k);
	      		}      		
			})(indexURL,chapters,req,items,k,Comics_8);
	    }else if(items.collected[k].site==='dm5'){
		    req.open('GET',indexURL);
		    req.responseType="document";
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
	let collected={
		collected:[]		
	};

	let readed={
		readed:[]
	};

	let update={
		update:[]
	};
	chrome.storage.local.get('readed',function(items){
	  let readedItem = Object.assign(readed,items);
	  chrome.storage.local.set(readedItem);
	});

	chrome.storage.local.get('update',function(items){
	  let updateItem = Object.assign(update,items);
	  chrome.storage.local.set(updateItem);
	});

	chrome.storage.local.get('collected',function(items){
	  let collectedItem = Object.assign(collected,items);
	  chrome.storage.local.set(collectedItem);
	});

	chrome.alarms.create("comicsQuery", {
       periodInMinutes: 1});
});

// chrome.tabs.onUpdated.addListener(redirectLocal);
// chrome.webNavigation.onCommitted.addListener
chrome.webNavigation.onCommitted.addListener
chrome.webNavigation.onCommitted.addListener(function(details) {
	console.log(details.url,Comics_8.regex.test(details.url));
	if(Comics_8.regex.test(details.url)){
		console.log("8 comics fired");
		let chapter=Comics_8.regex.exec(details.url)[1];
		chrome.tabs.update(details.tabId,{url: chrome.extension.getURL("reader.html")+"#/site/comics8/chapter"+chapter});
		ga('send', 'event', "8comics view");
	}else if(Comics_sf.regex.test(details.url)){
		console.log("sf fired");
		let chapter=Comics_sf.regex.exec(details.url)[1];
		chrome.tabs.update(details.tabId,{url: chrome.extension.getURL("reader.html")+"#/site/sf/chapter"+chapter});
		ga('send', 'event', "sf view");
	}else if((Comics_dm5.regex.test(details.url)||Comics_dm5.dm5regex.test(details.url))){
		console.log("dm5 fired");
		let chapter=""
		if(Comics_dm5.dm5regex.test(details.url)){
			chapter=Comics_dm5.dm5regex.exec(details.url)[2];
		}else{
			chapter=Comics_dm5.regex.exec(details.url)[1];
		}
		chrome.tabs.update(details.tabId,{url: chrome.extension.getURL("reader.html")+"#/site/dm5/chapter"+chapter});
		ga('send', 'event', "dm5 view");
	}
},{url:[
	{urlMatches: "comicbus\.com/online/\w*"},
		{urlMatches: "comic\.sfacg\.com\/HTML\/[^\/]+\/.+$"},
		{urlMatches: "http://(tel||www)\.dm5\.com/m\d*"}
		]
	});

chrome.alarms.onAlarm.addListener(function(alarm){
	comicsQuery();
});



(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.alocal=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://ssl.google-analytics.com/analytics.js','ga');
ga('create', 'UA-59728771-1', 'auto');
ga('set','checkProtocolTask', null);
ga('send', 'pageview');
  