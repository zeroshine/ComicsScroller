var notifications = require("sdk/notifications");
var tabs=require("sdk/tabs");
var ss=require("sdk/simple-storage");


var comics={
	regex: /http\:\/\/www\.manben\.com\/(m\d*\/)/,

	dm5regex: /http\:\/\/(tel||www)\.dm5\.com\/(m\d*\/)/,
	
	baseURL:"http://www.manben.com/",

	handleUrlHash:function(){
		var params_str=window.location.hash;
    	this.site= /site\/(.*)\/chapter/.exec(params_str)[1];
    	this.chapterURL=this.baseURL+(/chapter\/(.*\/)/.exec(params_str)[1]);
    	if(!(/#$/.test(params_str))){
	      document.getElementById("comics_panel").innerHTML="";
	      var index=-1;
	      for(var i=0;i<this.state.menuItems.size;++i){
	        if(this.state.menuItems.get(i).get('payload')===this.chapterURL){
	          index=i;
	          this.lastIndex=index;
	          this._getImage(index,this.chapterURL);
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
	backgroundOnload:function(button,indexURL,chapters,req,items,k){
      	var doc=req.response;
	   	var nl = this.getChapter(doc);
	   	var title=this.getTitleName(doc);
	   	var imgUrl=this.getCoverImg(doc);
      	var array=[];
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
				notifications.notify({
				  title: "Comics Update",
				  text: title+"  "+obj.lastReaded.text,
				  iconURL:'./comics-128.png',
				  data: item.payload,
				  onClick: function (data) {
				    tabs.open(data);
				  }
				});
				var uitems=ss.storage.update;
				var num=uitems.length.toString();
				button.badge=num;
			}
		}
	    items[k].menuItems=array;
	    ss.storage.collected=items;		
	}
};


module.exports=comics;

