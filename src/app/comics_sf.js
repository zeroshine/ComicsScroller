// var ObjectAssign=require('object-assign');
var Echo=require('./echo');
var Immutable = require('immutable');
var comics={
	regex: /http\:\/\/comic\.sfacg\.com\/(HTML\/[^\/]+\/.+)$/,

	baseURL:"http://comic.sfacg.com/",

	handleUrlHash:function(menuItems){
		var params_str=window.location.hash;
	    this.site= /site\/(\w*)\//.exec(params_str)[1];
	    this.pageURL=/chapter\/(HTML\/[^\/]+\/)/.exec(params_str)[1];   
	    this.chapterURL=this.baseURL+(/chapter\/(.*)$/.exec(params_str)[1]);
	    this.indexURL=this.baseURL+this.pageURL;
	    // console.log("chapterURL",this.chapterURL);
    	if(!(/#$/.test(params_str))){
	      // console.log('page back');
	      document.getElementById("comics_panel").innerHTML="";
	      var index=-1;
	      for(var i=0;i<menuItems.size;++i){
	        if(menuItems.get(i).get('payload')===this.chapterURL){
	          index=i;
	          this.lastIndex=index;
	          break;
	        }
	      }
	      this.getImage(index,this.chapterURL);
	    }else{
	      this.chapterURL=this.baseURL+(/chapter\/(.*\/)#$/.exec(params_str)[1]);
	      window.history.replaceState('',document.title,"#/site/sf/chapter/"+(/chapter\/(.*\/)#$/.exec(params_str)[1]));
	    }  
	},

	getChapter:function(doc){
		var nl=doc.querySelectorAll(".serialise_list>li>a");
		return nl;
	},

	getTitleName:function(doc){
		this.title=doc.querySelector("body > table:nth-child(8) > tbody > tr > td:nth-child(1) > table:nth-child(2) > tbody > tr > td > h1 > b").textContent;
		return this.title;
	},

	getCoverImg:function(doc){
		this.iconUrl=doc.querySelector(".comic_cover>img").src;
		return this.iconUrl;
	},

  	getImage: function(index,url){
    	var req=new XMLHttpRequest();
    	req.open("GET",url,true);
    	req.responseType="document";
    	req.withCredentials = true;
    	req.onload=(function(index,req,self){
	      	return function(){
	        	var doc=req.response;
	        	var scriptURL=/src=\"(\/Utility.*\.js)\">/.exec(doc.head.innerHTML)[1]; 
	        	var xhr = new XMLHttpRequest();
	        	xhr.open("GET",self.baseURL+scriptURL,true);
	        	xhr.onload=(function(index,xhr,self){
		          	return function(){
		            	self.setImages(index,xhr);    
		          	}
	        	})(index,xhr,self);
	        	xhr.send();
	      	}
    	})(index,req,this);
    	req.send();
  	},

  	// markedItems: Immutable.Set(),

  	getMenuItems:function(doc,markedItems){
		var nl = this.getChapter(doc);      
	    var array=[];
	    this.initIndex=-1;
	    for(var i=0;i<nl.length;++i){
	      var item={};
	      item.payload=nl[i].href;
	      item.text=nl[i].textContent;
	      if(item.payload===this.chapterURL&&this.initIndex===-1){
	        this.initIndex=i;
	        document.title=this.title+" "+item.text;
	        this.setImageIndex(i);
	        item.isMarked=true;
	        if(!markedItems.has(item.payload)){
	          markedItems=markedItems.add(item.payload);
	        }
	      }
	      if(markedItems.has(item.payload)){
	        item.isMarked=true;  
	      }
	      item=Immutable.Map(item);
	      array.push(item);
	    }
	    this.markedItems=markedItems;
	    return Immutable.List(array);
	},

	chapterUpdateIndex: -1,
  
  	setImageIndex:function(index){
    	if(this.chapterUpdateIndex===-1){
      		this.chapterUpdateIndex=index;
    	}else if(this.chapterUpdateIndex===-2){
      		var imgs=document.querySelectorAll('img[data-chapter=\"-1\"]');
      		for(var i=0;i<imgs.length;++i){
        		imgs[i].setAttribute("data-chapter",index);
      		}
      		this.chapterUpdateIndex=-1;  
    	}
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
	
	appendImage:function(index){
	    var comics_panel=document.getElementById("comics_panel");
	    if(index===-1){
	      index=this.chapterUpdateIndex;
	      this.chapterUpdateIndex=-2;
	    }
	    for(var i=0;i<this.pageMax;++i){
	      var img=new Image();
	      img.src="../img/Transparent.gif";
	      img.setAttribute("data-echo",this.images[i]);
	      img.setAttribute("data-num",i+1);
	      img.setAttribute("data-chapter",index);
	      img.style.width="900px";
	      img.style.height="1300px";
	      img.style.borderWidth="1px";
	      img.style.borderColor="white";
	      img.style.borderStyle="solid";
	      img.setAttribute("data-pageMax",this.pageMax);
	      img.className="comics_img";
	      comics_panel.appendChild(img);
	    }
	    Echo.nodes=comics_panel.children;
	    var chapterEnd=document.createElement("div");
	    chapterEnd.className="comics_img_end";
	    chapterEnd.textContent="本話結束";
	    document.getElementById("comics_panel").appendChild(chapterEnd);
	    if(!Echo.hadInited){
	      Echo.init(); 
	    }else{
	      Echo.render();
	    }
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
				var obj={
					url:indexURL,
					title:title,
					site:'sf',
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
		items.collected[k].menuItems=array;
		chrome.storage.local.set(items);
	}
};



module.exports = comics;

