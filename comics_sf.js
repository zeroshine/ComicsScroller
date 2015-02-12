console.log("reader starts");
var comics=comics || { };
document.onreadystatechange = function () {
	if (document.readyState == "interactive") {
		comics.createItem=function(){
			comics.panel=document.createElement("div");
			comics.panel.id="comics_panel";
			
			comics.titlebar=document.createElement("div");
			comics.titlebar.id="comics_titlebar";

			comics.chaptertxt=document.createElement("a");
			comics.chaptertxt.id="comics_nextchaptertxt";
			
			comics.maxwidthbutton=document.createElement("button");
			comics.maxwidthbutton.className="comics_button";
			comics.maxwidthbutton.textContent="預設高度";
			comics.maxwidthbutton.addEventListener("click", function(){
	    		var imglist=document.getElementsByClassName("comics_img");
	    		for(var i=0; i< imglist.length;++i){
	    			console.log(imglist[i]);
	    			imglist[i].style.maxHeight="none";
	    			console.log(imglist[i]);
	    		}
			});

			comics.maxheightbutton=document.createElement("button");
			comics.maxheightbutton.className="comics_button";
			comics.maxheightbutton.textContent="符合畫面";
			comics.maxheightbutton.addEventListener("click", function(){
	    		var imglist=document.getElementsByClassName("comics_img");
	    		for(var i=0; i< imglist.length;++i){
	    			console.log(imglist[i]);
	    			imglist[i].style.maxHeight="92vh";
	    			console.log(imglist[i]);
	    		}
			});

			comics.buttonplace=document.createElement("div");
			comics.buttonplace.id="comics_button_place";

			comics.nextChapter=document.createElement("button");
			comics.nextChapter.className="comics_button";
			comics.nextChapter.textContent="下一章";
			comics.nextChapter.addEventListener("click", function(){
					window.location=comics.nextURL;
			});

			comics.preChapter=document.createElement("button");
			comics.preChapter.className="comics_button";
			comics.preChapter.textContent="上一章";
			comics.preChapter.addEventListener("click", function(){
					window.location=comics.preURL;
			});


			comics.buttonplace.appendChild(comics.preChapter);
			comics.buttonplace.appendChild(comics.nextChapter);
			// }
			
			comics.buttonplace.appendChild(comics.maxheightbutton);
			comics.buttonplace.appendChild(comics.maxwidthbutton);

			comics.titlebar.appendChild(comics.chaptertxt);
			comics.titlebar.appendChild(comics.buttonplace);
			comics.panel.appendChild(comics.titlebar);
			document.body.parentElement.appendChild(comics.panel);
			document.body.style.display="none";
			
			// comics.pageMax=document.getElementsByClassName("chose")[0].childElementCount;
			// comics.chapterId=/http\:\/\/manhua.ali213.net\/comic\/\d*\/(\d*).html/.exec(document.URL)[1];	
		}	
		comics.appendImage=function(){
			console.log('appendImage');
			for(var i=0;i<comics.pageMax;++i){
				console.log(comics.images[i]);
				var img=new Image();
				img.setAttribute("data-echo",comics.images[i]);
				img.setAttribute("data-num",i);
				img.setAttribute("data-title",comics.titleInfor+"第"+(i+1)+"/"+comics.pageMax+"頁");
				img.setAttribute("data-chapter",comics.chapterId);
				img.src="";
				img.className="comics_img";
				this.panel.appendChild(img);
			}	
		};
		comics.setImages=function(doc){
			var scriptURL=doc.evaluate("/html/head/script[2]",doc,null,XPathResult.ANY_TYPE,null).iterateNext().getAttribute('src');
			// var titlename=doc.evaluate("/html/body/div[2]/div/div[1]/a[3]",doc,null,XPathResult.ANY_TYPE,null).iterateNext().textContent;
			var chapternum=/http\:\/\/comic\.sfacg\.com\/HTML\/.*\/(\w*)\/$/.exec(doc.URL)[1];
			comics.chapterId=chapternum;
			var req = new XMLHttpRequest;
			req.open("GET",scriptURL);
			req.onload=function(){
				eval(req.response);
				comics.titleInfor=comicName+" / 第"+comics.chapterId+"話 ";		
				comics.nextURL_tmp=nextVolume;
				comics.preURL_tmp=preVolume;	
				if(nextVolume=="javascript:alert('已经是当前连载的最后一回!');"){
					comics.nextURL_tmp="";
					comics.maxChapter=comics.chapterId;	
				}
				if(preVolume=="javascript:alert('已经是当前连载的最初回!');"){
					comics.preURL_tmp="";	
				}

				var name = "picHost=";
				var picHost="";
    			var ca = document.cookie.split(';');
    			for(var i=0; i<ca.length; i++) {
        			var c = ca[i];
        			while (c.charAt(0)==' ') c = c.substring(1);
        			if (c.indexOf(name) == 0) picHost= c.substring(name.length,c.length);
    			}
    			picHost = picHost==null?0:picHost;
				picHost = hosts[picHost];
    			var img =[]; 
				comics.pageMax=picCount;
				for(var i=0;i<comics.pageMax;i++){
					img[i]=picHost+picAy[i];
				}
				comics.images=img;
				comics.appendImage();
			};
			req.send(); 
		}		
		
		

		comics.maxChapter=9999;
		comics.createItem();
		comics.setImages(document);	
		echo.init({
	    	offset: 2500,
	    	throttle: 100,
	    	unload: false,
	    	update: function () {
	    		if(comics.nextURL!==""){
		        	var req=new XMLHttpRequest();
				    // console.log("http://manhua.ali213.net"+comics.nextURL);
				    req.open("GET",comics.nextURL,true);
				    req.responseType="document";
				    req.onload=function(){
				      console.log(req.response);
				      var doc=req.response;
				      comics.setImages(doc);
				      // comics.appendImage();
				    };
				    req.send();
				}
	    	}
		});
	}
}
