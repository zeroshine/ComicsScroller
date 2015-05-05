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

