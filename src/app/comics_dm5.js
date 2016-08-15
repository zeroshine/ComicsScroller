let Echo=require('./echo');
let Immutable = require('immutable');
let parser= new DOMParser();
let comics={
	regex: /http\:\/\/www\.dm5\.com(\/m\d+\/)/,

	dm5regex: /http\:\/\/(tel||www)\.dm5\.com(\/m\d+\/)/,
	
	baseURL:"http://www.dm5.com",

	handleUrlHash: function(menuItems){
		let params_str=window.location.hash;
    	this.site= /site\/(.*)\/chapter/.exec(params_str)[1];
    	this.chapterURL=this.baseURL+(/chapter(\/.*\/)/.exec(params_str)[1]);

    	if(!(/#$/.test(params_str))){
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
	      window.history.replaceState('',document.title,"#/site/dm5/chapter/"+(/chapter\/(.*\/)/.exec(params_str)[1]));
	    }  
	},	

	getChapter:function(doc){
		let nl=doc.querySelectorAll("div#l2_1 > a");
		return nl;
	},

	getTitleName:function(doc){
		this.title=doc.querySelector("div.topToolBar > span.center > a:last-child").textContent;
		return this.title;
	},

    getComicUrl:function(doc){
        this.comicUrl = doc.querySelector("div.topToolBar > span.center > a:nth-last-child(-n+2)").href;
        return this.comicUrl;
	},

    getCoverImg:async function() {
        let response = await fetch(this.comicUrl);
        let rtxt = await response.text();
        let doc = parser.parseFromString(rtxt,"text/html");
        this.iconUrl = doc.querySelector(".innr91>img").src;
        return this.iconUrl;
    },

	getIndexURL:async function(){
		// console.log(doc);
		let response = await fetch(this.chapterURL);
    	let rtxt = await response.text();
    	let doc=parser.parseFromString(rtxt,"text/html");
		this.indexURL=this.baseURL+doc.querySelector("div.topToolBar > span.center > a:last-child").getAttribute('href');
		return this.indexURL;
	},

	// markedItems: Immutable.Set(),

	getMenuItems:function(doc,markedItems){
		let nl = this.getChapter(doc);      
	    let array=[];
	    this.initIndex=-1;
	    for(let i=0;i<nl.length;++i){
	      let item={};
	      item.payload=this.baseURL+nl[i].getAttribute('href');
	      // console.log(item.payload);
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

	getImage: async function(index,url){
	  let response = await fetch(url);
	  let rtxt = await response.text();
	  let doc = parser.parseFromString(rtxt,"text/html");
	  this.setImages(url,index,doc);
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

	setImages:function(url,index,doc){
		let script1=/<script type\=\"text\/javascript\">(.*)reseturl/.exec(doc.body.innerHTML)[1];
		eval(script1);
		this.pageMax=DM5_IMAGE_COUNT;
		let img=[];
		for(let i=0;i<this.pageMax;++i){
			img[i]=url+"chapterfun.ashx?cid="+DM5_CID.toString()+"&page="+(i+1)+"&key=&language=1";
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
	      Echo.init({
	        imgRender: async function(elem){
	          let response= await fetch(elem.getAttribute("data-echo"));
	          let rtxt= await response.text();
	          eval(rtxt);
	          let req=new XMLHttpRequest();
	          if (typeof (hd_c) != "undefined" && hd_c.length > 0 && typeof (isrevtt) != "undefined") {
	            elem.src=hd_c[0];
	          }else{
	            elem.src=d[0];
	          }
	          elem.removeAttribute('data-echo');
	      	}
	      });
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
      	if(nl.length!==chapters.length) {
      		console.log('update',nl.length,chapters.length);	
      	}

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
		    if(!urlInChapter&&chapters.length>0){
				let obj={
					url:indexURL,
					title:title,
					site:'dm5',
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
	    items['collected'][k].menuItems=array;
	    chrome.storage.local.set(items);		
	}
};


module.exports=comics;

