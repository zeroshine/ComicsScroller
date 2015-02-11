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
function sfacg(chapter){
	var js=$('script[src^=\\/Utility\\/]').filter(function(){ return $(this).attr('src').match(/Utility\/\d+/)!=null}).attr('src');
	var script;
	$.ajax({
		url:js,
		async:false,dataType:"text",
		success:function(data){
			script=data;
		},error:function(x,e){log(e);}
	});
	eval(script);
	var picHost=$.cookie('picHost');
	picHost = picHost==null?0:picHost;
	picHost = hosts[picHost];
	var images =[]; 
	for(var i=1;i<=chapter.pageMax;i++){
		images[i-1]=picHost+picAy[i-1];
	}
	chapter["images"]=images;

	//h		

		comics.setImages=function(doc){
			var scriptURL=doc.evaluate("/html/head/script[2]",doc,null,XPathResult.ANY_TYPE,null).iterateNext().getAttribute('src');
			var req=new 


			var imgpath='';
			eval(doc.head.innerHTML.replace(/[\r\n]/g,'@@@').match(/(eval.*?)\/*@@@/)[1]);
			var titlename=doc.evaluate("//*[@id=\"enjoy_b\"]/div[1]/div[1]/h1/a",doc,null,XPathResult.ANY_TYPE, null).iterateNext().text;
			var chapternum=doc.evaluate("//*[@id=\"enjoy_b\"]/div[1]/div[1]/h2/a",doc,null,XPathResult.ANY_TYPE, null).iterateNext().text;
			chapternum=chapternum.substr(1, chapternum.length-2);
			comics.nextURL_tmp="http://manhua.ali213.net"+doc.evaluate("//*[@id=\"enjoy_b\"]/div[2]/ul/li[6]/a",doc,null,XPathResult.ANY_TYPE, null).iterateNext().getAttribute("href");
			comics.preURL_tmp="http://manhua.ali213.net"+doc.evaluate("//*[@id=\"enjoy_b\"]/div[2]/ul/li[2]/a",doc,null,XPathResult.ANY_TYPE, null).iterateNext().getAttribute("href");
			comics.titleInfor=titlename+" / 第"+chapternum+"話 ";
			comics.chapterId=chapternum;
			if(comics.nextURL_tmp=="http://manhua.ali213.net"+"javascript:void(0);"){
				comics.maxChapter=parseInt(chapternum);
				comics.nextURL_tmp="";
			}
				
			var img_domain='';
			comics.pageMax=pages;
			comics.chaptertxt.textContent=comics.titleInfor+"第 1/"+comics.pageMax+"頁";
			var verifystr=/http\:\/\/manhua.ali213.net\/comic\/\d*\/(\d*).html/.exec(doc.URL)[1];
			if (verifystr>144681){
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
				img.setAttribute("data-title",comics.titleInfor+"第"+(i+1)+"/"+comics.pageMax+"頁");
				img.setAttribute("data-chapter",comics.chapterId);
				img.src="";
				img.className="comics_img";
				this.panel.appendChild(img);
			}	
		};
		comics.nextURL="http://manhua.ali213.net"+document.evaluate("//*[@id=\"enjoy_b\"]/div[2]/ul/li[6]/a",document,null,XPathResult.ANY_TYPE, null).iterateNext().getAttribute("href");
		comics.preURL="http://manhua.ali213.net"+document.evaluate("//*[@id=\"enjoy_b\"]/div[2]/ul/li[2]/a",document,null,XPathResult.ANY_TYPE, null).iterateNext().getAttribute("href");
		
		comics.maxChapter=9999;
		comics.createItem();
		comics.setImages(document);
		if(comics.nextURL=="http://manhua.ali213.net"+"javascript:void(0);"){
			comics.nextChapter.style.display="none";
		}
		if(comics.preURL=="http://manhua.ali213.net"+"javascript:void(0);"){
			comics.preChapter.style.display="none";
		}
		comics.appendImage();	
		echo.init({
	    	offset: 2500,
	    	throttle: 100,
	    	unload: false,
	    	update: function () {
	    		if(comics.nextURL!==""){
		        	var req=new XMLHttpRequest();
				    console.log("http://manhua.ali213.net"+comics.nextURL);
				    req.open("GET",comics.nextURL,true);
				    req.responseType="document";
				    req.onload=function(){
				      console.log(req.response);
				      var doc=req.response;
				      comics.setImages(doc);
				      comics.appendImage();
				    };
				    req.send();
				}
	    	}
		});
	}
}
