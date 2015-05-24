// var ObjectAssign=require('object-assign');
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
	    // console.log('params_str',params_str);
    	if(!(/#$/.test(params_str))){
	      console.log('page back');
	      document.getElementById("comics_panel").innerHTML="";
	      var index=-1;
	      for(var i=0;i<this.state.menuItems.size;++i){
	        if(this.state.menuItems.get(i).get('payload')===this.baseURL+this.prefixURL+this.chapterNum){
	          index=i;
	          this.lastIndex=index;
	          this._getImage(index,this.chapterNum);
	          break;
	        }
	      }
	    }else{
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
    		var obj={
				url:indexURL,
				title:title,
				site:'comics8',
				iconUrl:imgUrl,
				lastReaded:item
			};
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
      		item.payload= this.getChapterUrl(nl[i].getAttribute("onclick"));
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
			    obj={
					url:indexURL,
					title:title,
					site:'comics8',
					iconUrl:imgUrl,
					lastReaded:item
				};
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
