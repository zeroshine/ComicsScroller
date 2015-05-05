(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
	if(Comics_8.regex.test(tab.url)&&changeInfo.status==='loading'){
		console.log("8 comics fired");
		var chapter=Comics_8.regex.exec(tab.url)[1];
		chrome.tabs.update(tab.id,{url: chrome.extension.getURL("reader.html")+"/#/site/comics8/chapter/"+chapter});
		ga('send', 'event', "8comics view");
	}else if(Comics_sf.regex.test(tab.url)&&changeInfo.status==='loading'){
		console.log("sf fired");
		var chapter=Comics_sf.regex.exec(tab.url)[1];
		chrome.tabs.update(tab.id,{url: chrome.extension.getURL("reader.html")+"/#/site/sf/chapter/"+chapter});
		ga('send', 'event', "sf view");
	}else if((Comics_dm5.regex.test(tab.url)||Comics_dm5.dm5regex.test(tab.url))&&changeInfo.status==='loading'){
		console.log("dm5 fired");
		var chapter=""
		if(Comics_dm5.dm5regex.test(tab.url)){
			chapter=Comics_dm5.dm5regex.exec(tab.url)[2];
		}else{
			chapter=Comics_dm5.regex.exec(tab.url)[1];
		}
		chrome.tabs.update(tab.id,{url: chrome.extension.getURL("reader.html")+"/#/site/dm5/chapter/"+chapter});
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
  

},{"./app/comics_8.js":3,"./app/comics_dm5.js":4,"./app/comics_sf.js":5,"object-assign":2}],2:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],3:[function(require,module,exports){
var ObjectAssign=require('object-assign');
var comics={
	regex: /http\:\/\/new\.comicvip\.com\/show\/(.*-\d*.html\?ch=\d*)/,

	baseURL: "http://new.comicvip.com/show/",
	
	comicspageURL: "http://www.comicvip.com/html/",	

	handleUrlHash:function(){
		var params_str=window.location.hash;
	    this.site= /site\/(\w*)/.exec(params_str)[1];
	    this.pageURL=/chapter\/.*-(\d*\.html)\?/.exec(params_str)[1];   
	    this.chapterNum=/chapter\/.*\?ch\=(\d*)/.exec(params_str)[1];
	    this.prefixURL=/chapter\/(.*\?ch\=)\d*/.exec(params_str)[1];;  
	    this.indexURL=this.comicspageURL+this.pageURL;
    	if(!(/#$/.test(params_str))){
	      console.log('page back');
	      document.getElementById("comics_panel").innerHTML="";
	      var index=-1;
	      for(var i=0;i<this.state.menuItems.length;++i){
	        if(this.state.menuItems[i].payload===this.baseURL+this.prefixURL+this.chapterNum&&index===-1){
	          index=i;
	          this.lastIndex=index;
	          this._getImage(index,this.chapterNum);
	          this.setState({selectedIndex:index,chapter:this.state.menuItems[index].text,pageratio:""});
	          break;
	        }
	      }
	    }else{
	      console.log("replace with","#/site/comics8/chapter/"+(/chapter\/(.*)#$/.exec(params_str)[1]));	
	      window.history.replaceState('',document.title,"#/site/comics8/chapter/"+(/chapter\/(.*)#$/.exec(params_str)[1]));
	    }  
	},

	getChapter: function(doc){
		return doc.querySelectorAll(".Vol , .ch , #lch");
	},

	getChapterUrl:function(str){
		var p_array=/cview\(\'(.*-\d*\.html)\',(\d*)/.exec(str);
      	var catid=p_array[2];
      	var url=p_array[1];
		var baseurl="";
		if(catid==4 || catid==6 || catid==12 ||catid==22 ) baseurl="http://new.comicvip.com/show/cool-";
		if(catid==1 || catid==17 || catid==19 || catid==21) baseurl="http://new.comicvip.com/show/cool-";
		if(catid==2 || catid==5 || catid==7 || catid==9)  baseurl="http://new.comicvip.com/show/cool-";
		if(catid==10 || catid==11 || catid==13 || catid==14) baseurl="http://new.comicvip.com/show/best-manga-";
		if(catid==3 || catid==8 || catid==15 || catid==16 ||catid==18 ||catid==20)baseurl="http://new.comicvip.com/show/best-manga-";
		url=url.replace(".html","").replace("-",".html?ch=");
		return baseurl+url;
	},

	getTitleName: function(doc){
		return doc.querySelector("body > table:nth-child(7) > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(1) > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(2) > font").textContent;
	},

	getCoverImg:function(doc){
		return doc.querySelector("body > table:nth-child(7) > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(1) > img").src;
	},

	setImages: function(index,doc){
		var script=doc.evaluate("//*[@id=\"Form1\"]/script/text()",doc,null,XPathResult.ANY_TYPE, null).iterateNext().textContent.split('eval')[0];
		eval(script);
		var ch = /.*ch\=(.*)/.exec(doc.URL)[1];
		if (ch.indexOf('#') > 0)
			ch = ch.split('#')[0];
		var p = 1;
		var f = 50;
		if (ch.indexOf('-') > 0) {
			p = parseInt(ch.split('-')[1]);
			ch = ch.split('-')[0];
		}
		if (ch == '')
			ch = 1;
		else
	   		ch = parseInt(ch);
		var ss=function (a, b, c, d) {
			var e = a.substring(b, b + c);
			return d == null ? e.replace(/[a-z]*/gi, "") : e;
		};
		var nn = function(n) {
			return n < 10 ? '00' + n : n < 100 ? '0' + n : n;
		};
		var mm = function (p) {
			return (parseInt((p - 1) / 10) % 10) + (((p - 1) % 10) * 3)
		};
		var c="";
		var cc = cs.length;
		for (var j = 0; j < cc / f; j++) {
			if (ss(cs, j * f, 4) == ch) {
		    	c = ss(cs, j * f, f, f);
			    ci = j;
			    break;
			}
		}
		if (c == '') {
			c = ss(cs, cc - f, f);
			ch = c;
		}			    
		ps=ss(c, 7, 3);
		this.pageMax=ps;
		var img=[];
		for(var i=0;i<this.pageMax;++i){
			var c="";
			var cc = cs.length;
			for (var j = 0; j < cc / f; j++) {
			    if (ss(cs, j * f, 4) == ch) {
			        c = ss(cs, j * f, f, f);
			        ci = j;
			        break;
			    }
			}
			if (c == '') {
			    c = ss(cs, cc - f, f);
			    ch = chs;
			}
			img[i]='http://img' + ss(c, 4, 2) + '.8comic.com/' + ss(c, 6, 1) + '/' + ti + '/' + ss(c, 0, 4) + '/' + nn(i+1) + '_' + ss(c, mm(i+1) + 10, 3, f) + '.jpg';
		}
		this.images=img;
		this.appendImage(index);
	},
	backgroundOnload:function(indexURL,chapters,req,items,k){
	    var doc=req.response;
		var nl = this.getChapter(doc);
		var title=this.getTitleName(doc);
	    var imgUrl=this.getCoverImg(doc);
	    var array=[];
		var obj={};
		var item={};
		item.payload=Comics_8.getChapterUrl(nl[nl.length-2].getAttribute("onclick"));
		item.text=nl[nl.length-1].textContent;
		array.push(item);
		var urlInChapter=false;
	    for(var j=0;j<chapters.length;++j){
	    	if(chapters[j].payload===item.payload){
	    		urlInChapter=true;
	    		break;
	    	}
	    }
    	if(urlInChapter===false&&chapters.length>0){
    		ObjectAssign(obj,{
				url:indexURL,
				title:title,
				site:'comics8',
				iconUrl:imgUrl,
				lastReaded:item
			});
		    chrome.notifications.create(item.payload,{
				type:"image",
				iconUrl:'img/comics-64.png',
				title:"Comics Update",
				message:title+"  "+obj.lastReaded.text,
				imageUrl:imgUrl
			});
			chrome.storage.local.get('update',function(items){							
				items.update.push(this);
				var num=items.update.length.toString();
				chrome.browserAction.setBadgeText({text:num});
				chrome.storage.local.set(items);
			}.bind(obj));
		}
		for(var i=nl.length-3;i>=0;--i){
			var item={};
      		item.payload= Comics_8.getChapterUrl(nl[i].getAttribute("onclick"));
		    item.text=nl[i].textContent.trim();
		    array.push(item);
		    var obj={};
		    var urlInChapter=false;
		    for(var j=0;j<chapters.length;++j){
			    if(chapters[j].payload===item.payload){
			    	urlInChapter=true;
			    	break;
			    }
			}
		    if(urlInChapter===false&&chapters.length>0){
			    ObjectAssign(obj,{
					url:indexURL,
					title:title,
					site:'comics8',
					iconUrl:imgUrl,
					lastReaded:item
				});
				chrome.notifications.create(item.payload,{
					type:"image",
					iconUrl:'img/comics-64.png',
					title:"Comics Update",
					message:title+"  "+obj.lastReaded.text,
					imageUrl:imgUrl
				});
				chrome.storage.local.get('update',function(items){							
					items.update.push(this);
					var num=items.update.length.toString();
					chrome.browserAction.setBadgeText({text:num});
					chrome.storage.local.set(items);
				}.bind(obj));
		    }
		}
		items['collected'][k].menuItems=array;
		chrome.storage.local.set(items);		
	}
};

module.exports = comics;


},{"object-assign":2}],4:[function(require,module,exports){
var comics={
	regex: /http\:\/\/www\.manben\.com\/(m\d*\/)/,

	dm5regex: /http\:\/\/(tel||www)\.dm5\.com\/(m\d*\/)/,
	
	baseURL:"http://www.manben.com/",

	handleUrlHash:function(){
		var params_str=window.location.hash;
    	this.site= /site\/(.*)/.exec(params_str)[1];
    	this.chapterURL=this.baseURL+(/chapter\/(.*\/)/.exec(params_str)[1]);
    	if(!(/#$/.test(params_str))){
	      document.getElementById("comics_panel").innerHTML="";
	      var index=-1;
	      for(var i=0;i<this.state.menuItems.length;++i){
	        if(this.state.menuItems[i].payload===this.chapterURL&&index===-1){
	          index=i;
	          this.lastIndex=index;
	          this._getImage(index,this.chapterURL);
	          this.setState({selectedIndex:index,chapter:this.state.menuItems[index].text,pageratio:""});
	          break;
	        }
	      }
	    }else{
	      window.history.replaceState('',document.title,"#/site/dm5/chapter/"+(/chapter\/(.*\/)/.exec(params_str)[1]));
	    }  
	},	

	getChapter:function(doc){
		var nl=doc.querySelectorAll(".nr6.lan2>li>.tg");
		return nl;
	},

	getTitleName:function(doc){
		return doc.querySelector(".inbt_title_h2").textContent;
	},

	getCoverImg:function(doc){
		return doc.querySelector(".innr91>img").src;
	},

	setImages:function(index,xhr){
		var doc=xhr.response;
		var script1=/<script type\=\"text\/javascript\">(.*)reseturl/.exec(doc.head.innerHTML)[1];
		eval(script1);
		this.pageMax=DM5_IMAGE_COUNT;
		var img=[];
		for(var i=0;i<this.pageMax;++i){
			img[i]=doc.URL+"chapterfun.ashx?cid="+DM5_CID.toString()+"&page="+(i+1)+"&key=&language=1";
		}
		this.images=img;
		this.appendImage(index);		
	},
	backgroundOnload:function(indexURL,chapters,req,items,k){
      	var doc=req.response;
	   	var nl = this.getChapter(doc);
	   	var title=this.getTitleName(doc);
	   	var imgUrl=this.getCoverImg(doc);
      	var array=[];
      	var obj={};
      	for(var i=0;i<nl.length;++i){
		  	var item={};
	       	item.payload=nl[i].href;
	       	item.text=nl[i].textContent;				      	
		    array.push(item);
		    var urlInChapter=false;
		  	for(var j=0;j<chapters.length;++j){
    			if(chapters[j].payload===item.payload){
    				urlInChapter=true;
    				break;
    			}
    		}
		    if(urlInChapter===false&&chapters.length>0){
				ObjectAssign(obj,{
					url:indexURL,
					title:title,
					site:'dm5',
					iconUrl:imgUrl,
					lastReaded:item
				});
		    	chrome.notifications.create(item.payload,{
					type:"image",
					iconUrl:'img/comics-64.png',
					title:"Comics Update",
					message:title+"  "+obj.lastReaded.text,
					imageUrl:imgUrl
				});
				chrome.storage.local.get('update',function(items){							
					items.update.push(this);
					var num=items.update.length.toString();
					chrome.browserAction.setBadgeText({text:num});
					chrome.storage.local.set(items);
				}.bind(obj));
			}
		}
	    items['collected'][k].menuItems=array;
	    chrome.storage.local.set(items);		
	}
};


module.exports=comics;



},{}],5:[function(require,module,exports){
var ObjectAssign=require('object-assign');
var comics={
	regex: /http\:\/\/comic\.sfacg\.com\/(HTML\/[^\/]+\/.+)$/,

	baseURL:"http://comic.sfacg.com/",

	handleUrlHash:function(){
		var params_str=window.location.hash;
	    this.site= /site\/(\w*)\//.exec(params_str)[1];
	    this.pageURL=/chapter\/(HTML\/[^\/]+\/)/.exec(params_str)[1];   
	    this.chapterURL=this.baseURL+(/chapter\/(.*)$/.exec(params_str)[1]);
	    this.indexURL=this.baseURL+this.pageURL;
	    console.log("chapterURL",this.chapterURL);
    	if(!(/#$/.test(params_str))){
	      console.log('page back');
	      document.getElementById("comics_panel").innerHTML="";
	      var index=-1;
	      for(var i=0;i<this.state.menuItems.length;++i){
	        if(this.state.menuItems[i].payload===this.chapterURL&&index===-1){
	          index=i;
	          this.lastIndex=index;
	          this._getImage(index,this.chapterURL);
	          this.setState({selectedIndex:index,chapter:this.state.menuItems[index].text,pageratio:""});
	          break;
	        }
	      }
	    }else{
	      window.history.replaceState('',document.title,"#/site/sf/chapter/"+(/chapter\/(.*\/)$/.exec(params_str)[1]));
	    }  
	},

	getChapter:function(doc){
		var nl=doc.querySelectorAll(".serialise_list>li>a");
		return nl;
	},

	getTitleName:function(doc){
		return doc.querySelector("body > table:nth-child(8) > tbody > tr > td:nth-child(1) > table:nth-child(2) > tbody > tr > td > h1 > b").textContent;
	},

	getCoverImg:function(doc){
		return doc.querySelector(".comic_cover>img").src;
	},

	setImages:function(index,xhr){
		eval(xhr.response);
		var name = "picHost=";
		var picHost= hosts[0];
    	var img =[]; 
		this.pageMax=picCount;
		for(var i=0;i<this.pageMax;i++){
			img[i]=picHost+picAy[i];
		}
		this.images=img;
		this.appendImage(index);		 
	},
	backgroundOnload:function(indexURL,chapters,req,items,k){
		var doc=req.response;
		var nl = this.getChapter(doc);
		var title=this.getTitleName(doc);
		var imgUrl=this.getCoverImg(doc);
		var array=[];
		var obj={};
		// chapters.pop();
		for(var i=0;i<nl.length;++i){
		    var item={};
		    item.payload=nl[i].href;
		    item.text=nl[i].textContent;
		    array.push(item);
		    var urlInChapter=false;  				    		
		    for(var j=0;j<chapters.length;++j){
		    	if(chapters[j].payload===item.payload){
		    		urlInChapter=true;
		    		break;
		    	}
		    }
		    if(!urlInChapter && chapters.length>0){
				ObjectAssign(obj,{
					url:indexURL,
					title:title,
					site:'sf',
					iconUrl:imgUrl,
					lastReaded:item
				});
				   chrome.notifications.create(item.payload,{
					type:"image",
					iconUrl:'img/comics-64.png',
					title:"Comics Update",
					message:title+"  "+obj.lastReaded.text,
					imageUrl:imgUrl
				});
				chrome.storage.local.get('update',function(items){							
					items.update.push(this);
					var num=items.update.length.toString();
					chrome.browserAction.setBadgeText({text:num});
					chrome.storage.local.set(items);
				}.bind(obj));							
		    }
		}
		items.collected[k].menuItems=array;
		chrome.storage.local.set(items);
	}
};



module.exports = comics;



},{"object-assign":2}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvemVyb3NoaW5lL0Ryb3Bib3gvZXh0ZW5zaW9uX3Byb2plY3QvQ29taWNzU3JvbGxlci9zcmMvYmFja2dyb3VuZC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwiL1VzZXJzL3plcm9zaGluZS9Ecm9wYm94L2V4dGVuc2lvbl9wcm9qZWN0L0NvbWljc1Nyb2xsZXIvc3JjL2FwcC9jb21pY3NfOC5qcyIsIi9Vc2Vycy96ZXJvc2hpbmUvRHJvcGJveC9leHRlbnNpb25fcHJvamVjdC9Db21pY3NTcm9sbGVyL3NyYy9hcHAvY29taWNzX2RtNS5qcyIsIi9Vc2Vycy96ZXJvc2hpbmUvRHJvcGJveC9leHRlbnNpb25fcHJvamVjdC9Db21pY3NTcm9sbGVyL3NyYy9hcHAvY29taWNzX3NmLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzFDLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzVDLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzFDLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQzlDLElBQUksU0FBUyxDQUFDO0NBQ2IsU0FBUyxDQUFDLEVBQUU7QUFDYixDQUFDLENBQUM7O0FBRUYsSUFBSSxNQUFNLENBQUM7Q0FDVixNQUFNLENBQUMsRUFBRTtBQUNWLENBQUMsQ0FBQzs7QUFFRixJQUFJLE1BQU0sQ0FBQztDQUNWLE1BQU0sQ0FBQyxFQUFFO0FBQ1YsQ0FBQyxDQUFDOztBQUVGLElBQUksYUFBYSxHQUFHLFNBQVMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNsRCxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztFQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDOUIsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsMEJBQTBCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztFQUM1RyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztFQUNwQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0VBQ3JFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7RUFDeEIsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztFQUN2RyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztFQUMvQixLQUFLLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0VBQzNHLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDekIsSUFBSSxPQUFPLENBQUMsRUFBRTtFQUNkLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ3BDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDN0MsSUFBSTtHQUNKLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDMUM7RUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7RUFDeEcsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7RUFDaEM7QUFDRixDQUFDLENBQUM7QUFDRjs7QUFFQSxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztDQUN2RCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlCLENBQUMsQ0FBQyxDQUFDOztBQUVILElBQUksV0FBVyxHQUFHLFVBQVUsQ0FBQztDQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsS0FBSyxDQUFDLENBQUM7TUFDaEQsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO09BQ3hDLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO09BQ3BDLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO09BQzFDLElBQUksR0FBRyxDQUFDLElBQUksY0FBYyxFQUFFLENBQUM7S0FDL0IsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDekIsR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7S0FDNUIsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7TUFDakMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUMzRCxPQUFPLFVBQVUsQ0FBQztVQUNqQixTQUFTLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1VBQzlEO0lBQ04sRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO01BQ3pDLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7TUFDNUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMxRCxPQUFPLFVBQVUsQ0FBQztVQUNqQixRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1VBQzdEO0lBQ04sRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO01BQ3hDLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7TUFDeEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM1RCxPQUFPLFVBQVUsQ0FBQztVQUNqQixVQUFVLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1VBQy9EO0lBQ04sRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO01BQzFDO0tBQ0QsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ1o7RUFDRixDQUFDLENBQUM7QUFDSixDQUFDO0FBQ0Q7O0FBRUEsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUVqRCxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsS0FBSyxDQUFDLENBQUM7RUFDaEQsSUFBSSxVQUFVLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUM1QyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdkMsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEtBQUssQ0FBQyxDQUFDO0VBQ2hELElBQUksVUFBVSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDNUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZDLENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUNyRCxFQUFFLElBQUksYUFBYSxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXBELEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7O0dBRWpELFdBQVcsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQzlDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0g7O0FBRUEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQztBQUM1RSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7QUFDN0UsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQy9FLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsK0NBQStDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEYsRUFBRSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdEMsRUFBRSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDOzs7O0FDMUd2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMxQyxJQUFJLE1BQU0sQ0FBQztBQUNYLENBQUMsS0FBSyxFQUFFLDJEQUEyRDs7QUFFbkUsQ0FBQyxPQUFPLEVBQUUsK0JBQStCOztBQUV6QyxDQUFDLGFBQWEsRUFBRSwrQkFBK0I7O0NBRTlDLGFBQWEsQ0FBQyxVQUFVLENBQUM7RUFDeEIsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7S0FDakMsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzdDLElBQUksQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzdELElBQUksQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzdELElBQUksQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDOUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztPQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQ3pCLFFBQVEsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztPQUNyRCxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNiLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDNUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1dBQzNGLEtBQUssQ0FBQyxDQUFDLENBQUM7V0FDUixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztXQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7V0FDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztXQUMzRixNQUFNO1VBQ1A7UUFDRjtNQUNGLElBQUk7T0FDSCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyx5QkFBeUIsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQzlGLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDbEg7QUFDTixFQUFFOztDQUVELFVBQVUsRUFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0VBQ3pCLE9BQU8sR0FBRyxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDbkQsRUFBRTs7Q0FFRCxhQUFhLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztFQUMzQixJQUFJLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDbkQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3JCLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN4QixJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUM7RUFDZixHQUFHLEtBQUssRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsSUFBSSxLQUFLLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLG9DQUFvQyxDQUFDO0VBQ2hHLEdBQUcsS0FBSyxFQUFFLENBQUMsSUFBSSxLQUFLLEVBQUUsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLElBQUksS0FBSyxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsb0NBQW9DLENBQUM7RUFDakcsR0FBRyxLQUFLLEVBQUUsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxvQ0FBb0MsQ0FBQztFQUMvRixHQUFHLEtBQUssRUFBRSxFQUFFLElBQUksS0FBSyxFQUFFLEVBQUUsSUFBSSxLQUFLLEVBQUUsRUFBRSxJQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLDBDQUEwQyxDQUFDO0VBQ3hHLEdBQUcsS0FBSyxFQUFFLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxJQUFJLEtBQUssRUFBRSxFQUFFLElBQUksS0FBSyxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLDBDQUEwQyxDQUFDO0VBQzdILEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBQ3JELE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUNyQixFQUFFOztDQUVELFlBQVksRUFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0VBQzNCLE9BQU8sR0FBRyxDQUFDLGFBQWEsQ0FBQyxtTUFBbU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUM1TyxFQUFFOztDQUVELFdBQVcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0VBQ3pCLE9BQU8sR0FBRyxDQUFDLGFBQWEsQ0FBQyx1R0FBdUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUN4SSxFQUFFOztDQUVELFNBQVMsRUFBRSxTQUFTLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUM5QixJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGtDQUFrQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzNJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUNiLElBQUksRUFBRSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3ZDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0dBQ3RCLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNWLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztFQUNYLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7R0FDeEIsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDL0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDdEI7RUFDRCxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ2QsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztNQUVKLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztHQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FDOUIsT0FBTyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUNqRCxDQUFDO0VBQ0YsSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQztHQUNyQixPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ2pELENBQUM7RUFDRixJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDO0dBQ3RCLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQzNELENBQUM7RUFDRixJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUM7RUFDVCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO0VBQ25CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0dBQ2hDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtPQUN4QixDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUN4QixFQUFFLEdBQUcsQ0FBQyxDQUFDO09BQ1AsTUFBTTtJQUNUO0dBQ0Q7RUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUU7R0FDWixDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQ3RCLEVBQUUsR0FBRyxDQUFDLENBQUM7R0FDUDtFQUNELEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0VBQ2hCLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQztFQUNYLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0dBQzlCLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztHQUNULElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7R0FDbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7T0FDN0IsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1dBQ3hCLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1dBQ3hCLEVBQUUsR0FBRyxDQUFDLENBQUM7V0FDUCxNQUFNO1FBQ1Q7SUFDSjtHQUNELElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRTtPQUNULENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDdEIsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUNaO0dBQ0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxjQUFjLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUs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LENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxLQUFLLENBQUMsQ0FBQztLQUNqRCxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4QixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUN2QyxNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQzlDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNoQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO09BQ1Y7R0FDSjtFQUNELEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztFQUNuQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDaEM7QUFDRixDQUFDLENBQUM7QUFDRjtBQUNBOztBQUVBLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBPYmplY3RBc3NpZ249cmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIENvbWljc19zZj1yZXF1aXJlKCcuL2FwcC9jb21pY3Nfc2YuanMnKTtcbnZhciBDb21pY3NfOD1yZXF1aXJlKCcuL2FwcC9jb21pY3NfOC5qcycpO1xudmFyIENvbWljc19kbTU9cmVxdWlyZSgnLi9hcHAvY29taWNzX2RtNS5qcycpO1xudmFyIGNvbGxlY3RlZD17XG5cdGNvbGxlY3RlZDpbXVx0XHRcbn07XG5cbnZhciByZWFkZWQ9e1xuXHRyZWFkZWQ6W11cbn07XG5cbnZhciB1cGRhdGU9e1xuXHR1cGRhdGU6W11cbn07XG5cbnZhciByZWRpcmVjdExvY2FsID0gZnVuY3Rpb24odGFiSWQsY2hhbmdlSW5mbyx0YWIpe1xuXHRpZihDb21pY3NfOC5yZWdleC50ZXN0KHRhYi51cmwpJiZjaGFuZ2VJbmZvLnN0YXR1cz09PSdsb2FkaW5nJyl7XG5cdFx0Y29uc29sZS5sb2coXCI4IGNvbWljcyBmaXJlZFwiKTtcblx0XHR2YXIgY2hhcHRlcj1Db21pY3NfOC5yZWdleC5leGVjKHRhYi51cmwpWzFdO1xuXHRcdGNocm9tZS50YWJzLnVwZGF0ZSh0YWIuaWQse3VybDogY2hyb21lLmV4dGVuc2lvbi5nZXRVUkwoXCJyZWFkZXIuaHRtbFwiKStcIi8jL3NpdGUvY29taWNzOC9jaGFwdGVyL1wiK2NoYXB0ZXJ9KTtcblx0XHRnYSgnc2VuZCcsICdldmVudCcsIFwiOGNvbWljcyB2aWV3XCIpO1xuXHR9ZWxzZSBpZihDb21pY3Nfc2YucmVnZXgudGVzdCh0YWIudXJsKSYmY2hhbmdlSW5mby5zdGF0dXM9PT0nbG9hZGluZycpe1xuXHRcdGNvbnNvbGUubG9nKFwic2YgZmlyZWRcIik7XG5cdFx0dmFyIGNoYXB0ZXI9Q29taWNzX3NmLnJlZ2V4LmV4ZWModGFiLnVybClbMV07XG5cdFx0Y2hyb21lLnRhYnMudXBkYXRlKHRhYi5pZCx7dXJsOiBjaHJvbWUuZXh0ZW5zaW9uLmdldFVSTChcInJlYWRlci5odG1sXCIpK1wiLyMvc2l0ZS9zZi9jaGFwdGVyL1wiK2NoYXB0ZXJ9KTtcblx0XHRnYSgnc2VuZCcsICdldmVudCcsIFwic2Ygdmlld1wiKTtcblx0fWVsc2UgaWYoKENvbWljc19kbTUucmVnZXgudGVzdCh0YWIudXJsKXx8Q29taWNzX2RtNS5kbTVyZWdleC50ZXN0KHRhYi51cmwpKSYmY2hhbmdlSW5mby5zdGF0dXM9PT0nbG9hZGluZycpe1xuXHRcdGNvbnNvbGUubG9nKFwiZG01IGZpcmVkXCIpO1xuXHRcdHZhciBjaGFwdGVyPVwiXCJcblx0XHRpZihDb21pY3NfZG01LmRtNXJlZ2V4LnRlc3QodGFiLnVybCkpe1xuXHRcdFx0Y2hhcHRlcj1Db21pY3NfZG01LmRtNXJlZ2V4LmV4ZWModGFiLnVybClbMl07XG5cdFx0fWVsc2V7XG5cdFx0XHRjaGFwdGVyPUNvbWljc19kbTUucmVnZXguZXhlYyh0YWIudXJsKVsxXTtcblx0XHR9XG5cdFx0Y2hyb21lLnRhYnMudXBkYXRlKHRhYi5pZCx7dXJsOiBjaHJvbWUuZXh0ZW5zaW9uLmdldFVSTChcInJlYWRlci5odG1sXCIpK1wiLyMvc2l0ZS9kbTUvY2hhcHRlci9cIitjaGFwdGVyfSk7XG5cdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCBcImRtNSB2aWV3XCIpO1xuXHR9XG59O1xuXG5cbmNocm9tZS5ub3RpZmljYXRpb25zLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbihpZCl7XG5cdGNocm9tZS50YWJzLmNyZWF0ZSh7dXJsOmlkfSk7XG59KTtcblxudmFyIGNvbWljc1F1ZXJ5ID0gZnVuY3Rpb24oKXtcblx0Y2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdjb2xsZWN0ZWQnLGZ1bmN0aW9uKGl0ZW1zKXtcbiAgICAgIGZvcih2YXIgaz0wO2s8aXRlbXMuY29sbGVjdGVkLmxlbmd0aDsrK2spe1xuICAgICAgXHR2YXIgaW5kZXhVUkw9aXRlbXMuY29sbGVjdGVkW2tdLnVybDtcbiAgICAgIFx0dmFyIGNoYXB0ZXJzPWl0ZW1zLmNvbGxlY3RlZFtrXS5tZW51SXRlbXM7XG4gICAgICBcdHZhciByZXE9bmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdCAgICByZXEub3BlbignR0VUJyxpbmRleFVSTCk7XG5cdCAgICByZXEucmVzcG9uc2VUeXBlPVwiZG9jdW1lbnRcIjtcblx0ICAgIGlmKGl0ZW1zLmNvbGxlY3RlZFtrXS5zaXRlPT09J3NmJyl7XG5cdCAgICBcdHJlcS5vbmxvYWQ9KGZ1bmN0aW9uKGluZGV4VVJMLGNoYXB0ZXJzLHJlcSxpdGVtcyxrLENvbWljc19zZil7XG5cdCAgICAgIFx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcblx0ICAgICAgXHRcdFx0Q29taWNzX3NmLmJhY2tncm91bmRPbmxvYWQoaW5kZXhVUkwsIGNoYXB0ZXJzLCByZXEsIGl0ZW1zLCBrKTtcblx0ICAgICAgXHRcdH0gICAgICBcdFx0XG5cdFx0XHR9KShpbmRleFVSTCxjaGFwdGVycyxyZXEsaXRlbXMsayxDb21pY3Nfc2YpO1xuXHQgICAgfWVsc2UgaWYoaXRlbXMuY29sbGVjdGVkW2tdLnNpdGU9PT0nY29taWNzOCcpe1xuXHQgICAgXHRyZXEub25sb2FkPShmdW5jdGlvbihpbmRleFVSTCxjaGFwdGVycyxyZXEsaXRlbXMsayxDb21pY3NfOCl7XG5cdCAgICAgIFx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcblx0ICAgICAgXHRcdFx0Q29taWNzXzguYmFja2dyb3VuZE9ubG9hZChpbmRleFVSTCwgY2hhcHRlcnMsIHJlcSwgaXRlbXMsIGspO1xuXHQgICAgICBcdFx0fSAgICAgIFx0XHRcblx0XHRcdH0pKGluZGV4VVJMLGNoYXB0ZXJzLHJlcSxpdGVtcyxrLENvbWljc184KTtcblx0ICAgIH1lbHNlIGlmKGl0ZW1zLmNvbGxlY3RlZFtrXS5zaXRlPT09J2RtNScpe1xuXHQgICAgXHRyZXEub25sb2FkPShmdW5jdGlvbihpbmRleFVSTCxjaGFwdGVycyxyZXEsaXRlbXMsayxDb21pY3NfZG01KXtcblx0ICAgICAgXHRcdHJldHVybiBmdW5jdGlvbigpe1xuXHQgICAgICBcdFx0XHRDb21pY3NfZG01LmJhY2tncm91bmRPbmxvYWQoaW5kZXhVUkwsIGNoYXB0ZXJzLCByZXEsIGl0ZW1zLCBrKTtcblx0ICAgICAgXHRcdH0gICAgICBcdFx0XG5cdFx0XHR9KShpbmRleFVSTCxjaGFwdGVycyxyZXEsaXRlbXMsayxDb21pY3NfZG01KTtcblx0ICAgIH1cblx0ICAgIHJlcS5zZW5kKCk7XG5cdCAgfVxuXHR9KTtcbn1cblxuXG5jaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIocmVkaXJlY3RMb2NhbCk7XG5cbmNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgncmVhZGVkJyxmdW5jdGlvbihpdGVtcyl7XG4gIHZhciByZWFkZWRJdGVtID0gT2JqZWN0QXNzaWduKHJlYWRlZCxpdGVtcyk7XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldChyZWFkZWRJdGVtKTtcbn0pO1xuXG5jaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3VwZGF0ZScsZnVuY3Rpb24oaXRlbXMpe1xuICB2YXIgdXBkYXRlSXRlbSA9IE9iamVjdEFzc2lnbih1cGRhdGUsaXRlbXMpO1xuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQodXBkYXRlSXRlbSk7XG59KTtcblxuY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdjb2xsZWN0ZWQnLGZ1bmN0aW9uKGl0ZW1zKXtcbiAgdmFyIGNvbGxlY3RlZEl0ZW0gPSBPYmplY3RBc3NpZ24oY29sbGVjdGVkLGl0ZW1zKTtcbiAgLy8gY29uc29sZS5sb2coY29sbGVjdGVkSXRlbSk7XG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldChjb2xsZWN0ZWRJdGVtLGZ1bmN0aW9uKCl7XG4gIFx0Ly8gY29taWNzUXVlcnkoKTtcbiAgXHRzZXRJbnRlcnZhbChmdW5jdGlvbigpe2NvbWljc1F1ZXJ5KCk7fSw2MDAwMCk7XG4gIH0pO1xufSk7XG5cblxuKGZ1bmN0aW9uKGkscyxvLGcscixhLG0pe2lbJ0dvb2dsZUFuYWx5dGljc09iamVjdCddPXI7aVtyXT1pW3JdfHxmdW5jdGlvbigpe1xuKGlbcl0ucT1pW3JdLnF8fFtdKS5wdXNoKGFyZ3VtZW50cyl9LGlbcl0ubD0xKm5ldyBEYXRlKCk7YT1zLmNyZWF0ZUVsZW1lbnQobyksXG5tPXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUobylbMF07YS5hbG9jYWw9MTthLnNyYz1nO20ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSxtKVxufSkod2luZG93LGRvY3VtZW50LCdzY3JpcHQnLCdodHRwczovL3NzbC5nb29nbGUtYW5hbHl0aWNzLmNvbS9hbmFseXRpY3MuanMnLCdnYScpO1xuZ2EoJ2NyZWF0ZScsICdVQS01OTcyODc3MS0xJywgJ2F1dG8nKTtcbmdhKCdzZXQnLCdjaGVja1Byb3RvY29sVGFzaycsIG51bGwpO1xuZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcbiAgIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBUb09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PSBudWxsKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIGtleXM7XG5cdHZhciB0byA9IFRvT2JqZWN0KHRhcmdldCk7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gYXJndW1lbnRzW3NdO1xuXHRcdGtleXMgPSBPYmplY3Qua2V5cyhPYmplY3QoZnJvbSkpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0b1trZXlzW2ldXSA9IGZyb21ba2V5c1tpXV07XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsInZhciBPYmplY3RBc3NpZ249cmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIGNvbWljcz17XG5cdHJlZ2V4OiAvaHR0cFxcOlxcL1xcL25ld1xcLmNvbWljdmlwXFwuY29tXFwvc2hvd1xcLyguKi1cXGQqLmh0bWxcXD9jaD1cXGQqKS8sXG5cblx0YmFzZVVSTDogXCJodHRwOi8vbmV3LmNvbWljdmlwLmNvbS9zaG93L1wiLFxuXHRcblx0Y29taWNzcGFnZVVSTDogXCJodHRwOi8vd3d3LmNvbWljdmlwLmNvbS9odG1sL1wiLFx0XG5cblx0aGFuZGxlVXJsSGFzaDpmdW5jdGlvbigpe1xuXHRcdHZhciBwYXJhbXNfc3RyPXdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuXHQgICAgdGhpcy5zaXRlPSAvc2l0ZVxcLyhcXHcqKS8uZXhlYyhwYXJhbXNfc3RyKVsxXTtcblx0ICAgIHRoaXMucGFnZVVSTD0vY2hhcHRlclxcLy4qLShcXGQqXFwuaHRtbClcXD8vLmV4ZWMocGFyYW1zX3N0cilbMV07ICAgXG5cdCAgICB0aGlzLmNoYXB0ZXJOdW09L2NoYXB0ZXJcXC8uKlxcP2NoXFw9KFxcZCopLy5leGVjKHBhcmFtc19zdHIpWzFdO1xuXHQgICAgdGhpcy5wcmVmaXhVUkw9L2NoYXB0ZXJcXC8oLipcXD9jaFxcPSlcXGQqLy5leGVjKHBhcmFtc19zdHIpWzFdOzsgIFxuXHQgICAgdGhpcy5pbmRleFVSTD10aGlzLmNvbWljc3BhZ2VVUkwrdGhpcy5wYWdlVVJMO1xuICAgIFx0aWYoISgvIyQvLnRlc3QocGFyYW1zX3N0cikpKXtcblx0ICAgICAgY29uc29sZS5sb2coJ3BhZ2UgYmFjaycpO1xuXHQgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbWljc19wYW5lbFwiKS5pbm5lckhUTUw9XCJcIjtcblx0ICAgICAgdmFyIGluZGV4PS0xO1xuXHQgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuc3RhdGUubWVudUl0ZW1zLmxlbmd0aDsrK2kpe1xuXHQgICAgICAgIGlmKHRoaXMuc3RhdGUubWVudUl0ZW1zW2ldLnBheWxvYWQ9PT10aGlzLmJhc2VVUkwrdGhpcy5wcmVmaXhVUkwrdGhpcy5jaGFwdGVyTnVtJiZpbmRleD09PS0xKXtcblx0ICAgICAgICAgIGluZGV4PWk7XG5cdCAgICAgICAgICB0aGlzLmxhc3RJbmRleD1pbmRleDtcblx0ICAgICAgICAgIHRoaXMuX2dldEltYWdlKGluZGV4LHRoaXMuY2hhcHRlck51bSk7XG5cdCAgICAgICAgICB0aGlzLnNldFN0YXRlKHtzZWxlY3RlZEluZGV4OmluZGV4LGNoYXB0ZXI6dGhpcy5zdGF0ZS5tZW51SXRlbXNbaW5kZXhdLnRleHQscGFnZXJhdGlvOlwiXCJ9KTtcblx0ICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfWVsc2V7XG5cdCAgICAgIGNvbnNvbGUubG9nKFwicmVwbGFjZSB3aXRoXCIsXCIjL3NpdGUvY29taWNzOC9jaGFwdGVyL1wiKygvY2hhcHRlclxcLyguKikjJC8uZXhlYyhwYXJhbXNfc3RyKVsxXSkpO1x0XG5cdCAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSgnJyxkb2N1bWVudC50aXRsZSxcIiMvc2l0ZS9jb21pY3M4L2NoYXB0ZXIvXCIrKC9jaGFwdGVyXFwvKC4qKSMkLy5leGVjKHBhcmFtc19zdHIpWzFdKSk7XG5cdCAgICB9ICBcblx0fSxcblxuXHRnZXRDaGFwdGVyOiBmdW5jdGlvbihkb2Mpe1xuXHRcdHJldHVybiBkb2MucXVlcnlTZWxlY3RvckFsbChcIi5Wb2wgLCAuY2ggLCAjbGNoXCIpO1xuXHR9LFxuXG5cdGdldENoYXB0ZXJVcmw6ZnVuY3Rpb24oc3RyKXtcblx0XHR2YXIgcF9hcnJheT0vY3ZpZXdcXChcXCcoLiotXFxkKlxcLmh0bWwpXFwnLChcXGQqKS8uZXhlYyhzdHIpO1xuICAgICAgXHR2YXIgY2F0aWQ9cF9hcnJheVsyXTtcbiAgICAgIFx0dmFyIHVybD1wX2FycmF5WzFdO1xuXHRcdHZhciBiYXNldXJsPVwiXCI7XG5cdFx0aWYoY2F0aWQ9PTQgfHwgY2F0aWQ9PTYgfHwgY2F0aWQ9PTEyIHx8Y2F0aWQ9PTIyICkgYmFzZXVybD1cImh0dHA6Ly9uZXcuY29taWN2aXAuY29tL3Nob3cvY29vbC1cIjtcblx0XHRpZihjYXRpZD09MSB8fCBjYXRpZD09MTcgfHwgY2F0aWQ9PTE5IHx8IGNhdGlkPT0yMSkgYmFzZXVybD1cImh0dHA6Ly9uZXcuY29taWN2aXAuY29tL3Nob3cvY29vbC1cIjtcblx0XHRpZihjYXRpZD09MiB8fCBjYXRpZD09NSB8fCBjYXRpZD09NyB8fCBjYXRpZD09OSkgIGJhc2V1cmw9XCJodHRwOi8vbmV3LmNvbWljdmlwLmNvbS9zaG93L2Nvb2wtXCI7XG5cdFx0aWYoY2F0aWQ9PTEwIHx8IGNhdGlkPT0xMSB8fCBjYXRpZD09MTMgfHwgY2F0aWQ9PTE0KSBiYXNldXJsPVwiaHR0cDovL25ldy5jb21pY3ZpcC5jb20vc2hvdy9iZXN0LW1hbmdhLVwiO1xuXHRcdGlmKGNhdGlkPT0zIHx8IGNhdGlkPT04IHx8IGNhdGlkPT0xNSB8fCBjYXRpZD09MTYgfHxjYXRpZD09MTggfHxjYXRpZD09MjApYmFzZXVybD1cImh0dHA6Ly9uZXcuY29taWN2aXAuY29tL3Nob3cvYmVzdC1tYW5nYS1cIjtcblx0XHR1cmw9dXJsLnJlcGxhY2UoXCIuaHRtbFwiLFwiXCIpLnJlcGxhY2UoXCItXCIsXCIuaHRtbD9jaD1cIik7XG5cdFx0cmV0dXJuIGJhc2V1cmwrdXJsO1xuXHR9LFxuXG5cdGdldFRpdGxlTmFtZTogZnVuY3Rpb24oZG9jKXtcblx0XHRyZXR1cm4gZG9jLnF1ZXJ5U2VsZWN0b3IoXCJib2R5ID4gdGFibGU6bnRoLWNoaWxkKDcpID4gdGJvZHkgPiB0ciA+IHRkID4gdGFibGUgPiB0Ym9keSA+IHRyOm50aC1jaGlsZCgxKSA+IHRkOm50aC1jaGlsZCgyKSA+IHRhYmxlOm50aC1jaGlsZCgxKSA+IHRib2R5ID4gdHI6bnRoLWNoaWxkKDEpID4gdGQgPiB0YWJsZSA+IHRib2R5ID4gdHIgPiB0ZDpudGgtY2hpbGQoMikgPiBmb250XCIpLnRleHRDb250ZW50O1xuXHR9LFxuXG5cdGdldENvdmVySW1nOmZ1bmN0aW9uKGRvYyl7XG5cdFx0cmV0dXJuIGRvYy5xdWVyeVNlbGVjdG9yKFwiYm9keSA+IHRhYmxlOm50aC1jaGlsZCg3KSA+IHRib2R5ID4gdHIgPiB0ZCA+IHRhYmxlID4gdGJvZHkgPiB0cjpudGgtY2hpbGQoMSkgPiB0ZDpudGgtY2hpbGQoMSkgPiBpbWdcIikuc3JjO1xuXHR9LFxuXG5cdHNldEltYWdlczogZnVuY3Rpb24oaW5kZXgsZG9jKXtcblx0XHR2YXIgc2NyaXB0PWRvYy5ldmFsdWF0ZShcIi8vKltAaWQ9XFxcIkZvcm0xXFxcIl0vc2NyaXB0L3RleHQoKVwiLGRvYyxudWxsLFhQYXRoUmVzdWx0LkFOWV9UWVBFLCBudWxsKS5pdGVyYXRlTmV4dCgpLnRleHRDb250ZW50LnNwbGl0KCdldmFsJylbMF07XG5cdFx0ZXZhbChzY3JpcHQpO1xuXHRcdHZhciBjaCA9IC8uKmNoXFw9KC4qKS8uZXhlYyhkb2MuVVJMKVsxXTtcblx0XHRpZiAoY2guaW5kZXhPZignIycpID4gMClcblx0XHRcdGNoID0gY2guc3BsaXQoJyMnKVswXTtcblx0XHR2YXIgcCA9IDE7XG5cdFx0dmFyIGYgPSA1MDtcblx0XHRpZiAoY2guaW5kZXhPZignLScpID4gMCkge1xuXHRcdFx0cCA9IHBhcnNlSW50KGNoLnNwbGl0KCctJylbMV0pO1xuXHRcdFx0Y2ggPSBjaC5zcGxpdCgnLScpWzBdO1xuXHRcdH1cblx0XHRpZiAoY2ggPT0gJycpXG5cdFx0XHRjaCA9IDE7XG5cdFx0ZWxzZVxuXHQgICBcdFx0Y2ggPSBwYXJzZUludChjaCk7XG5cdFx0dmFyIHNzPWZ1bmN0aW9uIChhLCBiLCBjLCBkKSB7XG5cdFx0XHR2YXIgZSA9IGEuc3Vic3RyaW5nKGIsIGIgKyBjKTtcblx0XHRcdHJldHVybiBkID09IG51bGwgPyBlLnJlcGxhY2UoL1thLXpdKi9naSwgXCJcIikgOiBlO1xuXHRcdH07XG5cdFx0dmFyIG5uID0gZnVuY3Rpb24obikge1xuXHRcdFx0cmV0dXJuIG4gPCAxMCA/ICcwMCcgKyBuIDogbiA8IDEwMCA/ICcwJyArIG4gOiBuO1xuXHRcdH07XG5cdFx0dmFyIG1tID0gZnVuY3Rpb24gKHApIHtcblx0XHRcdHJldHVybiAocGFyc2VJbnQoKHAgLSAxKSAvIDEwKSAlIDEwKSArICgoKHAgLSAxKSAlIDEwKSAqIDMpXG5cdFx0fTtcblx0XHR2YXIgYz1cIlwiO1xuXHRcdHZhciBjYyA9IGNzLmxlbmd0aDtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNjIC8gZjsgaisrKSB7XG5cdFx0XHRpZiAoc3MoY3MsIGogKiBmLCA0KSA9PSBjaCkge1xuXHRcdCAgICBcdGMgPSBzcyhjcywgaiAqIGYsIGYsIGYpO1xuXHRcdFx0ICAgIGNpID0gajtcblx0XHRcdCAgICBicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGMgPT0gJycpIHtcblx0XHRcdGMgPSBzcyhjcywgY2MgLSBmLCBmKTtcblx0XHRcdGNoID0gYztcblx0XHR9XHRcdFx0ICAgIFxuXHRcdHBzPXNzKGMsIDcsIDMpO1xuXHRcdHRoaXMucGFnZU1heD1wcztcblx0XHR2YXIgaW1nPVtdO1xuXHRcdGZvcih2YXIgaT0wO2k8dGhpcy5wYWdlTWF4OysraSl7XG5cdFx0XHR2YXIgYz1cIlwiO1xuXHRcdFx0dmFyIGNjID0gY3MubGVuZ3RoO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjYyAvIGY7IGorKykge1xuXHRcdFx0ICAgIGlmIChzcyhjcywgaiAqIGYsIDQpID09IGNoKSB7XG5cdFx0XHQgICAgICAgIGMgPSBzcyhjcywgaiAqIGYsIGYsIGYpO1xuXHRcdFx0ICAgICAgICBjaSA9IGo7XG5cdFx0XHQgICAgICAgIGJyZWFrO1xuXHRcdFx0ICAgIH1cblx0XHRcdH1cblx0XHRcdGlmIChjID09ICcnKSB7XG5cdFx0XHQgICAgYyA9IHNzKGNzLCBjYyAtIGYsIGYpO1xuXHRcdFx0ICAgIGNoID0gY2hzO1xuXHRcdFx0fVxuXHRcdFx0aW1nW2ldPSdodHRwOi8vaW1nJyArIHNzKGMsIDQsIDIpICsgJy44Y29taWMuY29tLycgKyBzcyhjLCA2LCAxKSArICcvJyArIHRpICsgJy8nICsgc3MoYywgMCwgNCkgKyAnLycgKyBubihpKzEpICsgJ18nICsgc3MoYywgbW0oaSsxKSArIDEwLCAzLCBmKSArICcuanBnJztcblx0XHR9XG5cdFx0dGhpcy5pbWFnZXM9aW1nO1xuXHRcdHRoaXMuYXBwZW5kSW1hZ2UoaW5kZXgpO1xuXHR9LFxuXHRiYWNrZ3JvdW5kT25sb2FkOmZ1bmN0aW9uKGluZGV4VVJMLGNoYXB0ZXJzLHJlcSxpdGVtcyxrKXtcblx0ICAgIHZhciBkb2M9cmVxLnJlc3BvbnNlO1xuXHRcdHZhciBubCA9IHRoaXMuZ2V0Q2hhcHRlcihkb2MpO1xuXHRcdHZhciB0aXRsZT10aGlzLmdldFRpdGxlTmFtZShkb2MpO1xuXHQgICAgdmFyIGltZ1VybD10aGlzLmdldENvdmVySW1nKGRvYyk7XG5cdCAgICB2YXIgYXJyYXk9W107XG5cdFx0dmFyIG9iaj17fTtcblx0XHR2YXIgaXRlbT17fTtcblx0XHRpdGVtLnBheWxvYWQ9Q29taWNzXzguZ2V0Q2hhcHRlclVybChubFtubC5sZW5ndGgtMl0uZ2V0QXR0cmlidXRlKFwib25jbGlja1wiKSk7XG5cdFx0aXRlbS50ZXh0PW5sW25sLmxlbmd0aC0xXS50ZXh0Q29udGVudDtcblx0XHRhcnJheS5wdXNoKGl0ZW0pO1xuXHRcdHZhciB1cmxJbkNoYXB0ZXI9ZmFsc2U7XG5cdCAgICBmb3IodmFyIGo9MDtqPGNoYXB0ZXJzLmxlbmd0aDsrK2ope1xuXHQgICAgXHRpZihjaGFwdGVyc1tqXS5wYXlsb2FkPT09aXRlbS5wYXlsb2FkKXtcblx0ICAgIFx0XHR1cmxJbkNoYXB0ZXI9dHJ1ZTtcblx0ICAgIFx0XHRicmVhaztcblx0ICAgIFx0fVxuXHQgICAgfVxuICAgIFx0aWYodXJsSW5DaGFwdGVyPT09ZmFsc2UmJmNoYXB0ZXJzLmxlbmd0aD4wKXtcbiAgICBcdFx0T2JqZWN0QXNzaWduKG9iaix7XG5cdFx0XHRcdHVybDppbmRleFVSTCxcblx0XHRcdFx0dGl0bGU6dGl0bGUsXG5cdFx0XHRcdHNpdGU6J2NvbWljczgnLFxuXHRcdFx0XHRpY29uVXJsOmltZ1VybCxcblx0XHRcdFx0bGFzdFJlYWRlZDppdGVtXG5cdFx0XHR9KTtcblx0XHQgICAgY2hyb21lLm5vdGlmaWNhdGlvbnMuY3JlYXRlKGl0ZW0ucGF5bG9hZCx7XG5cdFx0XHRcdHR5cGU6XCJpbWFnZVwiLFxuXHRcdFx0XHRpY29uVXJsOidpbWcvY29taWNzLTY0LnBuZycsXG5cdFx0XHRcdHRpdGxlOlwiQ29taWNzIFVwZGF0ZVwiLFxuXHRcdFx0XHRtZXNzYWdlOnRpdGxlK1wiICBcIitvYmoubGFzdFJlYWRlZC50ZXh0LFxuXHRcdFx0XHRpbWFnZVVybDppbWdVcmxcblx0XHRcdH0pO1xuXHRcdFx0Y2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCd1cGRhdGUnLGZ1bmN0aW9uKGl0ZW1zKXtcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRpdGVtcy51cGRhdGUucHVzaCh0aGlzKTtcblx0XHRcdFx0dmFyIG51bT1pdGVtcy51cGRhdGUubGVuZ3RoLnRvU3RyaW5nKCk7XG5cdFx0XHRcdGNocm9tZS5icm93c2VyQWN0aW9uLnNldEJhZGdlVGV4dCh7dGV4dDpudW19KTtcblx0XHRcdFx0Y2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KGl0ZW1zKTtcblx0XHRcdH0uYmluZChvYmopKTtcblx0XHR9XG5cdFx0Zm9yKHZhciBpPW5sLmxlbmd0aC0zO2k+PTA7LS1pKXtcblx0XHRcdHZhciBpdGVtPXt9O1xuICAgICAgXHRcdGl0ZW0ucGF5bG9hZD0gQ29taWNzXzguZ2V0Q2hhcHRlclVybChubFtpXS5nZXRBdHRyaWJ1dGUoXCJvbmNsaWNrXCIpKTtcblx0XHQgICAgaXRlbS50ZXh0PW5sW2ldLnRleHRDb250ZW50LnRyaW0oKTtcblx0XHQgICAgYXJyYXkucHVzaChpdGVtKTtcblx0XHQgICAgdmFyIG9iaj17fTtcblx0XHQgICAgdmFyIHVybEluQ2hhcHRlcj1mYWxzZTtcblx0XHQgICAgZm9yKHZhciBqPTA7ajxjaGFwdGVycy5sZW5ndGg7KytqKXtcblx0XHRcdCAgICBpZihjaGFwdGVyc1tqXS5wYXlsb2FkPT09aXRlbS5wYXlsb2FkKXtcblx0XHRcdCAgICBcdHVybEluQ2hhcHRlcj10cnVlO1xuXHRcdFx0ICAgIFx0YnJlYWs7XG5cdFx0XHQgICAgfVxuXHRcdFx0fVxuXHRcdCAgICBpZih1cmxJbkNoYXB0ZXI9PT1mYWxzZSYmY2hhcHRlcnMubGVuZ3RoPjApe1xuXHRcdFx0ICAgIE9iamVjdEFzc2lnbihvYmose1xuXHRcdFx0XHRcdHVybDppbmRleFVSTCxcblx0XHRcdFx0XHR0aXRsZTp0aXRsZSxcblx0XHRcdFx0XHRzaXRlOidjb21pY3M4Jyxcblx0XHRcdFx0XHRpY29uVXJsOmltZ1VybCxcblx0XHRcdFx0XHRsYXN0UmVhZGVkOml0ZW1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNocm9tZS5ub3RpZmljYXRpb25zLmNyZWF0ZShpdGVtLnBheWxvYWQse1xuXHRcdFx0XHRcdHR5cGU6XCJpbWFnZVwiLFxuXHRcdFx0XHRcdGljb25Vcmw6J2ltZy9jb21pY3MtNjQucG5nJyxcblx0XHRcdFx0XHR0aXRsZTpcIkNvbWljcyBVcGRhdGVcIixcblx0XHRcdFx0XHRtZXNzYWdlOnRpdGxlK1wiICBcIitvYmoubGFzdFJlYWRlZC50ZXh0LFxuXHRcdFx0XHRcdGltYWdlVXJsOmltZ1VybFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCd1cGRhdGUnLGZ1bmN0aW9uKGl0ZW1zKXtcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdGl0ZW1zLnVwZGF0ZS5wdXNoKHRoaXMpO1xuXHRcdFx0XHRcdHZhciBudW09aXRlbXMudXBkYXRlLmxlbmd0aC50b1N0cmluZygpO1xuXHRcdFx0XHRcdGNocm9tZS5icm93c2VyQWN0aW9uLnNldEJhZGdlVGV4dCh7dGV4dDpudW19KTtcblx0XHRcdFx0XHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoaXRlbXMpO1xuXHRcdFx0XHR9LmJpbmQob2JqKSk7XG5cdFx0ICAgIH1cblx0XHR9XG5cdFx0aXRlbXNbJ2NvbGxlY3RlZCddW2tdLm1lbnVJdGVtcz1hcnJheTtcblx0XHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoaXRlbXMpO1x0XHRcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21pY3M7XG4iLCJ2YXIgY29taWNzPXtcblx0cmVnZXg6IC9odHRwXFw6XFwvXFwvd3d3XFwubWFuYmVuXFwuY29tXFwvKG1cXGQqXFwvKS8sXG5cblx0ZG01cmVnZXg6IC9odHRwXFw6XFwvXFwvKHRlbHx8d3d3KVxcLmRtNVxcLmNvbVxcLyhtXFxkKlxcLykvLFxuXHRcblx0YmFzZVVSTDpcImh0dHA6Ly93d3cubWFuYmVuLmNvbS9cIixcblxuXHRoYW5kbGVVcmxIYXNoOmZ1bmN0aW9uKCl7XG5cdFx0dmFyIHBhcmFtc19zdHI9d2luZG93LmxvY2F0aW9uLmhhc2g7XG4gICAgXHR0aGlzLnNpdGU9IC9zaXRlXFwvKC4qKS8uZXhlYyhwYXJhbXNfc3RyKVsxXTtcbiAgICBcdHRoaXMuY2hhcHRlclVSTD10aGlzLmJhc2VVUkwrKC9jaGFwdGVyXFwvKC4qXFwvKS8uZXhlYyhwYXJhbXNfc3RyKVsxXSk7XG4gICAgXHRpZighKC8jJC8udGVzdChwYXJhbXNfc3RyKSkpe1xuXHQgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbWljc19wYW5lbFwiKS5pbm5lckhUTUw9XCJcIjtcblx0ICAgICAgdmFyIGluZGV4PS0xO1xuXHQgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuc3RhdGUubWVudUl0ZW1zLmxlbmd0aDsrK2kpe1xuXHQgICAgICAgIGlmKHRoaXMuc3RhdGUubWVudUl0ZW1zW2ldLnBheWxvYWQ9PT10aGlzLmNoYXB0ZXJVUkwmJmluZGV4PT09LTEpe1xuXHQgICAgICAgICAgaW5kZXg9aTtcblx0ICAgICAgICAgIHRoaXMubGFzdEluZGV4PWluZGV4O1xuXHQgICAgICAgICAgdGhpcy5fZ2V0SW1hZ2UoaW5kZXgsdGhpcy5jaGFwdGVyVVJMKTtcblx0ICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkSW5kZXg6aW5kZXgsY2hhcHRlcjp0aGlzLnN0YXRlLm1lbnVJdGVtc1tpbmRleF0udGV4dCxwYWdlcmF0aW86XCJcIn0pO1xuXHQgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9ZWxzZXtcblx0ICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKCcnLGRvY3VtZW50LnRpdGxlLFwiIy9zaXRlL2RtNS9jaGFwdGVyL1wiKygvY2hhcHRlclxcLyguKlxcLykvLmV4ZWMocGFyYW1zX3N0cilbMV0pKTtcblx0ICAgIH0gIFxuXHR9LFx0XG5cblx0Z2V0Q2hhcHRlcjpmdW5jdGlvbihkb2Mpe1xuXHRcdHZhciBubD1kb2MucXVlcnlTZWxlY3RvckFsbChcIi5ucjYubGFuMj5saT4udGdcIik7XG5cdFx0cmV0dXJuIG5sO1xuXHR9LFxuXG5cdGdldFRpdGxlTmFtZTpmdW5jdGlvbihkb2Mpe1xuXHRcdHJldHVybiBkb2MucXVlcnlTZWxlY3RvcihcIi5pbmJ0X3RpdGxlX2gyXCIpLnRleHRDb250ZW50O1xuXHR9LFxuXG5cdGdldENvdmVySW1nOmZ1bmN0aW9uKGRvYyl7XG5cdFx0cmV0dXJuIGRvYy5xdWVyeVNlbGVjdG9yKFwiLmlubnI5MT5pbWdcIikuc3JjO1xuXHR9LFxuXG5cdHNldEltYWdlczpmdW5jdGlvbihpbmRleCx4aHIpe1xuXHRcdHZhciBkb2M9eGhyLnJlc3BvbnNlO1xuXHRcdHZhciBzY3JpcHQxPS88c2NyaXB0IHR5cGVcXD1cXFwidGV4dFxcL2phdmFzY3JpcHRcXFwiPiguKilyZXNldHVybC8uZXhlYyhkb2MuaGVhZC5pbm5lckhUTUwpWzFdO1xuXHRcdGV2YWwoc2NyaXB0MSk7XG5cdFx0dGhpcy5wYWdlTWF4PURNNV9JTUFHRV9DT1VOVDtcblx0XHR2YXIgaW1nPVtdO1xuXHRcdGZvcih2YXIgaT0wO2k8dGhpcy5wYWdlTWF4OysraSl7XG5cdFx0XHRpbWdbaV09ZG9jLlVSTCtcImNoYXB0ZXJmdW4uYXNoeD9jaWQ9XCIrRE01X0NJRC50b1N0cmluZygpK1wiJnBhZ2U9XCIrKGkrMSkrXCIma2V5PSZsYW5ndWFnZT0xXCI7XG5cdFx0fVxuXHRcdHRoaXMuaW1hZ2VzPWltZztcblx0XHR0aGlzLmFwcGVuZEltYWdlKGluZGV4KTtcdFx0XG5cdH0sXG5cdGJhY2tncm91bmRPbmxvYWQ6ZnVuY3Rpb24oaW5kZXhVUkwsY2hhcHRlcnMscmVxLGl0ZW1zLGspe1xuICAgICAgXHR2YXIgZG9jPXJlcS5yZXNwb25zZTtcblx0ICAgXHR2YXIgbmwgPSB0aGlzLmdldENoYXB0ZXIoZG9jKTtcblx0ICAgXHR2YXIgdGl0bGU9dGhpcy5nZXRUaXRsZU5hbWUoZG9jKTtcblx0ICAgXHR2YXIgaW1nVXJsPXRoaXMuZ2V0Q292ZXJJbWcoZG9jKTtcbiAgICAgIFx0dmFyIGFycmF5PVtdO1xuICAgICAgXHR2YXIgb2JqPXt9O1xuICAgICAgXHRmb3IodmFyIGk9MDtpPG5sLmxlbmd0aDsrK2kpe1xuXHRcdCAgXHR2YXIgaXRlbT17fTtcblx0ICAgICAgIFx0aXRlbS5wYXlsb2FkPW5sW2ldLmhyZWY7XG5cdCAgICAgICBcdGl0ZW0udGV4dD1ubFtpXS50ZXh0Q29udGVudDtcdFx0XHRcdCAgICAgIFx0XG5cdFx0ICAgIGFycmF5LnB1c2goaXRlbSk7XG5cdFx0ICAgIHZhciB1cmxJbkNoYXB0ZXI9ZmFsc2U7XG5cdFx0ICBcdGZvcih2YXIgaj0wO2o8Y2hhcHRlcnMubGVuZ3RoOysrail7XG4gICAgXHRcdFx0aWYoY2hhcHRlcnNbal0ucGF5bG9hZD09PWl0ZW0ucGF5bG9hZCl7XG4gICAgXHRcdFx0XHR1cmxJbkNoYXB0ZXI9dHJ1ZTtcbiAgICBcdFx0XHRcdGJyZWFrO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0fVxuXHRcdCAgICBpZih1cmxJbkNoYXB0ZXI9PT1mYWxzZSYmY2hhcHRlcnMubGVuZ3RoPjApe1xuXHRcdFx0XHRPYmplY3RBc3NpZ24ob2JqLHtcblx0XHRcdFx0XHR1cmw6aW5kZXhVUkwsXG5cdFx0XHRcdFx0dGl0bGU6dGl0bGUsXG5cdFx0XHRcdFx0c2l0ZTonZG01Jyxcblx0XHRcdFx0XHRpY29uVXJsOmltZ1VybCxcblx0XHRcdFx0XHRsYXN0UmVhZGVkOml0ZW1cblx0XHRcdFx0fSk7XG5cdFx0ICAgIFx0Y2hyb21lLm5vdGlmaWNhdGlvbnMuY3JlYXRlKGl0ZW0ucGF5bG9hZCx7XG5cdFx0XHRcdFx0dHlwZTpcImltYWdlXCIsXG5cdFx0XHRcdFx0aWNvblVybDonaW1nL2NvbWljcy02NC5wbmcnLFxuXHRcdFx0XHRcdHRpdGxlOlwiQ29taWNzIFVwZGF0ZVwiLFxuXHRcdFx0XHRcdG1lc3NhZ2U6dGl0bGUrXCIgIFwiK29iai5sYXN0UmVhZGVkLnRleHQsXG5cdFx0XHRcdFx0aW1hZ2VVcmw6aW1nVXJsXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3VwZGF0ZScsZnVuY3Rpb24oaXRlbXMpe1x0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0aXRlbXMudXBkYXRlLnB1c2godGhpcyk7XG5cdFx0XHRcdFx0dmFyIG51bT1pdGVtcy51cGRhdGUubGVuZ3RoLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0Y2hyb21lLmJyb3dzZXJBY3Rpb24uc2V0QmFkZ2VUZXh0KHt0ZXh0Om51bX0pO1xuXHRcdFx0XHRcdGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldChpdGVtcyk7XG5cdFx0XHRcdH0uYmluZChvYmopKTtcblx0XHRcdH1cblx0XHR9XG5cdCAgICBpdGVtc1snY29sbGVjdGVkJ11ba10ubWVudUl0ZW1zPWFycmF5O1xuXHQgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KGl0ZW1zKTtcdFx0XG5cdH1cbn07XG5cblxubW9kdWxlLmV4cG9ydHM9Y29taWNzO1xuXG4iLCJ2YXIgT2JqZWN0QXNzaWduPXJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbnZhciBjb21pY3M9e1xuXHRyZWdleDogL2h0dHBcXDpcXC9cXC9jb21pY1xcLnNmYWNnXFwuY29tXFwvKEhUTUxcXC9bXlxcL10rXFwvLispJC8sXG5cblx0YmFzZVVSTDpcImh0dHA6Ly9jb21pYy5zZmFjZy5jb20vXCIsXG5cblx0aGFuZGxlVXJsSGFzaDpmdW5jdGlvbigpe1xuXHRcdHZhciBwYXJhbXNfc3RyPXdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuXHQgICAgdGhpcy5zaXRlPSAvc2l0ZVxcLyhcXHcqKVxcLy8uZXhlYyhwYXJhbXNfc3RyKVsxXTtcblx0ICAgIHRoaXMucGFnZVVSTD0vY2hhcHRlclxcLyhIVE1MXFwvW15cXC9dK1xcLykvLmV4ZWMocGFyYW1zX3N0cilbMV07ICAgXG5cdCAgICB0aGlzLmNoYXB0ZXJVUkw9dGhpcy5iYXNlVVJMKygvY2hhcHRlclxcLyguKikkLy5leGVjKHBhcmFtc19zdHIpWzFdKTtcblx0ICAgIHRoaXMuaW5kZXhVUkw9dGhpcy5iYXNlVVJMK3RoaXMucGFnZVVSTDtcblx0ICAgIGNvbnNvbGUubG9nKFwiY2hhcHRlclVSTFwiLHRoaXMuY2hhcHRlclVSTCk7XG4gICAgXHRpZighKC8jJC8udGVzdChwYXJhbXNfc3RyKSkpe1xuXHQgICAgICBjb25zb2xlLmxvZygncGFnZSBiYWNrJyk7XG5cdCAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29taWNzX3BhbmVsXCIpLmlubmVySFRNTD1cIlwiO1xuXHQgICAgICB2YXIgaW5kZXg9LTE7XG5cdCAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5zdGF0ZS5tZW51SXRlbXMubGVuZ3RoOysraSl7XG5cdCAgICAgICAgaWYodGhpcy5zdGF0ZS5tZW51SXRlbXNbaV0ucGF5bG9hZD09PXRoaXMuY2hhcHRlclVSTCYmaW5kZXg9PT0tMSl7XG5cdCAgICAgICAgICBpbmRleD1pO1xuXHQgICAgICAgICAgdGhpcy5sYXN0SW5kZXg9aW5kZXg7XG5cdCAgICAgICAgICB0aGlzLl9nZXRJbWFnZShpbmRleCx0aGlzLmNoYXB0ZXJVUkwpO1xuXHQgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c2VsZWN0ZWRJbmRleDppbmRleCxjaGFwdGVyOnRoaXMuc3RhdGUubWVudUl0ZW1zW2luZGV4XS50ZXh0LHBhZ2VyYXRpbzpcIlwifSk7XG5cdCAgICAgICAgICBicmVhaztcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1lbHNle1xuXHQgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoJycsZG9jdW1lbnQudGl0bGUsXCIjL3NpdGUvc2YvY2hhcHRlci9cIisoL2NoYXB0ZXJcXC8oLipcXC8pJC8uZXhlYyhwYXJhbXNfc3RyKVsxXSkpO1xuXHQgICAgfSAgXG5cdH0sXG5cblx0Z2V0Q2hhcHRlcjpmdW5jdGlvbihkb2Mpe1xuXHRcdHZhciBubD1kb2MucXVlcnlTZWxlY3RvckFsbChcIi5zZXJpYWxpc2VfbGlzdD5saT5hXCIpO1xuXHRcdHJldHVybiBubDtcblx0fSxcblxuXHRnZXRUaXRsZU5hbWU6ZnVuY3Rpb24oZG9jKXtcblx0XHRyZXR1cm4gZG9jLnF1ZXJ5U2VsZWN0b3IoXCJib2R5ID4gdGFibGU6bnRoLWNoaWxkKDgpID4gdGJvZHkgPiB0ciA+IHRkOm50aC1jaGlsZCgxKSA+IHRhYmxlOm50aC1jaGlsZCgyKSA+IHRib2R5ID4gdHIgPiB0ZCA+IGgxID4gYlwiKS50ZXh0Q29udGVudDtcblx0fSxcblxuXHRnZXRDb3ZlckltZzpmdW5jdGlvbihkb2Mpe1xuXHRcdHJldHVybiBkb2MucXVlcnlTZWxlY3RvcihcIi5jb21pY19jb3Zlcj5pbWdcIikuc3JjO1xuXHR9LFxuXG5cdHNldEltYWdlczpmdW5jdGlvbihpbmRleCx4aHIpe1xuXHRcdGV2YWwoeGhyLnJlc3BvbnNlKTtcblx0XHR2YXIgbmFtZSA9IFwicGljSG9zdD1cIjtcblx0XHR2YXIgcGljSG9zdD0gaG9zdHNbMF07XG4gICAgXHR2YXIgaW1nID1bXTsgXG5cdFx0dGhpcy5wYWdlTWF4PXBpY0NvdW50O1xuXHRcdGZvcih2YXIgaT0wO2k8dGhpcy5wYWdlTWF4O2krKyl7XG5cdFx0XHRpbWdbaV09cGljSG9zdCtwaWNBeVtpXTtcblx0XHR9XG5cdFx0dGhpcy5pbWFnZXM9aW1nO1xuXHRcdHRoaXMuYXBwZW5kSW1hZ2UoaW5kZXgpO1x0XHQgXG5cdH0sXG5cdGJhY2tncm91bmRPbmxvYWQ6ZnVuY3Rpb24oaW5kZXhVUkwsY2hhcHRlcnMscmVxLGl0ZW1zLGspe1xuXHRcdHZhciBkb2M9cmVxLnJlc3BvbnNlO1xuXHRcdHZhciBubCA9IHRoaXMuZ2V0Q2hhcHRlcihkb2MpO1xuXHRcdHZhciB0aXRsZT10aGlzLmdldFRpdGxlTmFtZShkb2MpO1xuXHRcdHZhciBpbWdVcmw9dGhpcy5nZXRDb3ZlckltZyhkb2MpO1xuXHRcdHZhciBhcnJheT1bXTtcblx0XHR2YXIgb2JqPXt9O1xuXHRcdC8vIGNoYXB0ZXJzLnBvcCgpO1xuXHRcdGZvcih2YXIgaT0wO2k8bmwubGVuZ3RoOysraSl7XG5cdFx0ICAgIHZhciBpdGVtPXt9O1xuXHRcdCAgICBpdGVtLnBheWxvYWQ9bmxbaV0uaHJlZjtcblx0XHQgICAgaXRlbS50ZXh0PW5sW2ldLnRleHRDb250ZW50O1xuXHRcdCAgICBhcnJheS5wdXNoKGl0ZW0pO1xuXHRcdCAgICB2YXIgdXJsSW5DaGFwdGVyPWZhbHNlOyAgXHRcdFx0XHQgICAgXHRcdFxuXHRcdCAgICBmb3IodmFyIGo9MDtqPGNoYXB0ZXJzLmxlbmd0aDsrK2ope1xuXHRcdCAgICBcdGlmKGNoYXB0ZXJzW2pdLnBheWxvYWQ9PT1pdGVtLnBheWxvYWQpe1xuXHRcdCAgICBcdFx0dXJsSW5DaGFwdGVyPXRydWU7XG5cdFx0ICAgIFx0XHRicmVhaztcblx0XHQgICAgXHR9XG5cdFx0ICAgIH1cblx0XHQgICAgaWYoIXVybEluQ2hhcHRlciAmJiBjaGFwdGVycy5sZW5ndGg+MCl7XG5cdFx0XHRcdE9iamVjdEFzc2lnbihvYmose1xuXHRcdFx0XHRcdHVybDppbmRleFVSTCxcblx0XHRcdFx0XHR0aXRsZTp0aXRsZSxcblx0XHRcdFx0XHRzaXRlOidzZicsXG5cdFx0XHRcdFx0aWNvblVybDppbWdVcmwsXG5cdFx0XHRcdFx0bGFzdFJlYWRlZDppdGVtXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQgICBjaHJvbWUubm90aWZpY2F0aW9ucy5jcmVhdGUoaXRlbS5wYXlsb2FkLHtcblx0XHRcdFx0XHR0eXBlOlwiaW1hZ2VcIixcblx0XHRcdFx0XHRpY29uVXJsOidpbWcvY29taWNzLTY0LnBuZycsXG5cdFx0XHRcdFx0dGl0bGU6XCJDb21pY3MgVXBkYXRlXCIsXG5cdFx0XHRcdFx0bWVzc2FnZTp0aXRsZStcIiAgXCIrb2JqLmxhc3RSZWFkZWQudGV4dCxcblx0XHRcdFx0XHRpbWFnZVVybDppbWdVcmxcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgndXBkYXRlJyxmdW5jdGlvbihpdGVtcyl7XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRpdGVtcy51cGRhdGUucHVzaCh0aGlzKTtcblx0XHRcdFx0XHR2YXIgbnVtPWl0ZW1zLnVwZGF0ZS5sZW5ndGgudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRjaHJvbWUuYnJvd3NlckFjdGlvbi5zZXRCYWRnZVRleHQoe3RleHQ6bnVtfSk7XG5cdFx0XHRcdFx0Y2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KGl0ZW1zKTtcblx0XHRcdFx0fS5iaW5kKG9iaikpO1x0XHRcdFx0XHRcdFx0XG5cdFx0ICAgIH1cblx0XHR9XG5cdFx0aXRlbXMuY29sbGVjdGVkW2tdLm1lbnVJdGVtcz1hcnJheTtcblx0XHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoaXRlbXMpO1xuXHR9XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBjb21pY3M7XG5cbiJdfQ==
