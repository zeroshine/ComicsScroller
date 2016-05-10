// let ObjectAssign=require('object-assign');
let Echo=require('./echo');
let Immutable = require('immutable');
let parser= new DOMParser();
let comics={

	regex: /http\:\/\/comic\.sfacg\.com(\/HTML\/[^\/]+\/.+)$/,

	baseURL:"http://comic.sfacg.com",

	handleUrlHash:function(menuItems){
		let params_str=window.location.hash;
	    this.site= /site\/(\w*)\//.exec(params_str)[1];
	    this.pageURL=/chapter(\/HTML\/[^\/]+\/)/.exec(params_str)[1];   
	    this.chapterURL=this.baseURL+(/chapter(\/.*)$/.exec(params_str)[1]);
	    this.indexURL=this.baseURL+this.pageURL;
	    // console.log("chapterURL",this.chapterURL);
    	if(!(/#$/.test(params_str))){
	      // console.log('page back');
	      document.getElementById("comics_panel").innerHTML="";
	      let index=-1;
	      for(let i=0;i<menuItems.size;++i){
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
		let nl=doc.querySelectorAll(".serialise_list>li>a");
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

	getIndexURL:async function(){
		return this.indexURL;
	},

  	getImage: async function(index,url){
    	let response = await fetch(url);
		let rtxt = await response.text();
		let doc = parser.parseFromString(rtxt,"text/html");
		let scriptURL=/src=\"(\/Utility.*\.js)\">/.exec(doc.head.innerHTML)[1]; 
    	let response2 = await fetch(this.baseURL+scriptURL);
		let rtxt2 = await response2.text();
		this.setImages(index,rtxt2);
  	},

  	// markedItems: Immutable.Set(),

  	getMenuItems:function(doc,markedItems){
		let nl = this.getChapter(doc);      
	    let array=[];
	    this.initIndex=-1;
	    for(let i=0;i<nl.length;++i){
	      let item={};
	      item.payload=this.baseURL+nl[i].getAttribute('href');
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
      		let imgs=document.querySelectorAll('img[data-chapter=\"-1\"]');
      		for(let i=0;i<imgs.length;++i){
        		imgs[i].setAttribute("data-chapter",index);
      		}
      		this.chapterUpdateIndex=-1;  
    	}
	},

	setImages:function(index,response){
		console.log(response);
		eval(response);
		let name = "picHost=";
		let picHost= hosts[1];
    	let img =[]; 
		this.pageMax=picCount;
		for(let i=0;i<this.pageMax;i++){
			img[i]=picHost+picAy[i];
		}
		this.images=img;
		this.appendImage(index);		 
	},
	
	appendImage:function(index){
	    let comics_panel=document.getElementById("comics_panel");
	    if(index===-1){
	      index=this.chapterUpdateIndex;
	      this.chapterUpdateIndex=-2;
	    }
	    for(let i=0;i<this.pageMax;++i){
	      let img=new Image();
	      img.src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
	      img.setAttribute("data-echo",this.images[i]);
	      img.setAttribute("data-num",i+1);
	      img.setAttribute("data-chapter",index);
	      img.style.width="900px";
	      img.style.height="1300px";
	      img.style.display='block';
	      img.style.borderWidth="1px";
	      img.style.borderColor="white";
	      img.style.borderStyle="solid";
	      img.style.marginLeft='auto';
	      img.style.marginRight='auto';
	      img.style.marginTop='10px';
	      img.style.marginBottom='50px';
	      img.style.maxWidth='100%';
	      img.style.background='#2a2a2a url(http://i.imgur.com/msdpdQm.gif) no-repeat center center';
	      img.setAttribute("data-pageMax",this.pageMax);
	      comics_panel.appendChild(img);
	    }
	    Echo.nodes=comics_panel.children;
	    let chapterEnd=document.createElement("div");
	    chapterEnd.className="comics_img_end";
	    chapterEnd.textContent="本話結束";
		comics_panel.appendChild(chapterEnd);
	    let chapterPromote=document.createElement("div");
	    chapterPromote.className="comics_img_promote";
	    chapterPromote.textContent="If you like Comics Scroller, give me a like on FB or Github.";
	    comics_panel.appendChild(chapterPromote);
	    if(!Echo.hadInited){
	      Echo.init(); 
	    }else{
	      Echo.render();
	    }
	},

	backgroundOnload:function(indexURL,chapters,req,items,k){
		let doc=req.response;
		let nl = this.getChapter(doc);
		let title=this.getTitleName(doc);
		let imgUrl=this.getCoverImg(doc);
		let array=[];
		let obj={};
		// chapters.pop();
		for(let i=0;i<nl.length;++i){
		    let item={};
		    item.payload=this.baseURL+nl[i].getAttribute('href');
		    item.text=nl[i].textContent;
		    array.push(item);
		    let urlInChapter=false;  				    		
		    for(let j=0;j<chapters.length;++j){
		    	if(chapters[j].payload===item.payload){
		    		urlInChapter=true;
		    		break;
		    	}
		    }
		    if(!urlInChapter && chapters.length>0){
				let obj={
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
					let num=items.update.length.toString();
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

