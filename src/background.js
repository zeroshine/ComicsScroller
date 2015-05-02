var ObjectAssign=require('object-assign');
var Comics_sf=require('./app/comics_sf.js');
var Comics_8=require('./app/comics_8.js');
var Comics_dm5=require('./app/comics_dm5.js');

var collected={
	collected:[]		
};

var readed={
	readed:[]
};

var update={
	update:[]
};

var redirectLocal = function(tabId,changeInfo,tab){
	// console.log("fired");
	var urlRegEX_ali=/http\:\/\/www\.158c\.com(\/comic\/\d*\/\d*\.html)/;
	var urlRegEX_8comics=/http\:\/\/new\.comicvip\.com\/show\/(.*-\d*.html\?ch=\d*)/;
	var urlRegEX_sf=/http\:\/\/comic\.sfacg\.com(\/HTML\/\w*\/\w*\/.*)/;
	var urlRegEX_manben=/http\:\/\/www\.manben\.com(\/m\d*\/)/;
	var urlRegEX_dm5=/http\:\/\/(tel||www)\.dm5\.com(\/m\d*\/)/;
	if(urlRegEX_8comics.test(tab.url)){
		console.log("8 comics fired");
		var chapter=urlRegEX_8comics.exec(tab.url)[1];
		chrome.tabs.update(tab.id,{url: chrome.extension.getURL("reader.html")+"?site=comics8&chapter="+chapter});
		ga('send', 'event', "8comics view");
	}else if(urlRegEX_sf.test(tab.url)){
		console.log("sf fired");
		var chapter=urlRegEX_sf.exec(tab.url)[1];
		chrome.tabs.update(tab.id,{url: chrome.extension.getURL("reader.html")+"?site=sf&chapter="+chapter});
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
		ga('send', 'event', "dm5 view");
	}
};


chrome.notifications.onClicked.addListener(function(id){
	chrome.tabs.create({url:id});
});

var comicsQuery = function(){
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


chrome.tabs.onUpdated.addListener(redirectLocal);

chrome.storage.local.get('readed',function(items){
  var readedItem = ObjectAssign(readed,items);
  chrome.storage.local.set(readedItem);
});

chrome.storage.local.get('update',function(items){
  var updateItem = ObjectAssign(update,items);
  chrome.storage.local.set(updateItem);
});

chrome.storage.local.get('collected',function(items){
  var collectedItem = ObjectAssign(collected,items);
  // console.log(collectedItem);
  chrome.storage.local.set(collectedItem,function(){
  	// comicsQuery();
  	setInterval(function(){comicsQuery();},60000);
  });
});


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.alocal=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://ssl.google-analytics.com/analytics.js','ga');
ga('create', 'UA-59728771-1', 'auto');
ga('set','checkProtocolTask', null);
ga('send', 'pageview');
  