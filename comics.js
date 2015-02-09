console.log("reader starts");
var comics=comics || { };
document.onreadystatechange = function () {
	if (document.readyState == "interactive") {
		
		comics.panel=document.createElement("div");
		comics.panel.id="comics_panel";
		
		comics.titlebar=document.createElement("div");
		comics.titlebar.id="comics_titlebar";

		comics.chaptertxt=document.createElement("a");
		comics.chaptertxt.id="comics_nextchaptertxt";
		
		comics.maxwidthbutton=document.createElement("button");
		comics.maxwidthbutton.className="comics_button";
		comics.maxwidthbutton.textContent="預設頁高";
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
		comics.maxheightbutton.textContent="符合頁高";
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
				window.location="http://manhua.ali213.net"+comics.nextURL;
		});
		comics.buttonplace.appendChild(comics.nextChapter);
		// }
		
		comics.buttonplace.appendChild(comics.maxheightbutton);
		comics.buttonplace.appendChild(comics.maxwidthbutton);

		comics.titlebar.appendChild(comics.chaptertxt);
		comics.titlebar.appendChild(comics.buttonplace);
		comics.panel.appendChild(comics.titlebar);
		document.body.parentElement.appendChild(comics.panel);
		document.body.style.display="none";
		
		comics.pageMax=document.getElementsByClassName("chose")[0].childElementCount;
		comics.chapterId=/http\:\/\/manhua.ali213.net\/comic\/\d*\/(\d*).html/.exec(document.URL)[1];

		comics.setImages=function(doc){
			var titlename=doc.evaluate("//*[@id=\"enjoy_b\"]/div[1]/div[1]/h1/a",doc,null,XPathResult.ANY_TYPE, null).iterateNext().text;
			var chapternum=doc.evaluate("//*[@id=\"enjoy_b\"]/div[1]/div[1]/h2/a",doc,null,XPathResult.ANY_TYPE, null).iterateNext().text;
			comics.nextURL_tmp=doc.evaluate("//*[@id=\"enjoy_b\"]/div[2]/ul/li[6]/a",doc,null,XPathResult.ANY_TYPE, null).iterateNext().getAttribute("href");
			comics.titleInfor=titlename+" / "+chapternum+"  ";
			comics.chaptertxt.textContent=comics.titleInfor;
			// comics.pageMax=document.getElementsByClassName("chose")[0].childElementCount;
			comics.chapterId=/http\:\/\/manhua.ali213.net\/comic\/\d*\/(\d*).html/.exec(doc.URL)[1];
			var imgpath=''
			eval(doc.head.innerHTML.replace(/[\r\n]/g,'@@@').match(/(eval.*?)\/*@@@/)[1]);
			var img_domain='';
			comics.pageMax=pages;
			if (comics.chapterId>144681){
				img_domain="http://mhimg1.ali213.net";
			}else{
				img_domain="http://mhimg.ali213.net";
			}
		
			var imgs =[]; 
		
			for(var i=0;i<comics.pageMax;i++){
				imgs[i]=img_domain+imgpath+i+".jpg";
			}
			comics.images=imgs;	
		}		
		
		comics.appendImage=function(){
			console.log('appendImage');
			for(var i=0;i<comics.pageMax;++i){
				console.log(comics.images[i]);
				var img=new Image();
				img.setAttribute("data-echo",comics.images[i]);
				img.setAttribute("data-num",i);
				img.setAttribute("data-title",comics.titleInfor+"     "+(i+1)+" / "+comics.pageMax);
				img.src="";
				img.className="comics_img";
				this.panel.appendChild(img);
			}	
		};
		comics.nextURL=document.evaluate("//*[@id=\"enjoy_b\"]/div[2]/ul/li[6]/a",document,null,XPathResult.ANY_TYPE, null).iterateNext().getAttribute("href");
		comics.setImages(document);
		comics.appendImage();	
		echo.init({
	    	offset: 2500,
	    	throttle: 100,
	    	unload: false,
	    	callback: function (element, op) {
	        // console.log(element, 'has been', op + 'ed')
	    	}
		});
	}
}
