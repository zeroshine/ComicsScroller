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
	          this.setState({selectedIndex:index,chapter:this.state.menuItems[index].text,pageratio:""},function(){
	          	this._saveStoreReaded();
	          }.bind(this));
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

