console.log("reader starts");
// var comics=comics || { };
document.onreadystatechange = function () {
	if (document.readyState == "interactive") {
		comics.setImages=function(doc){
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
			if(comics.preURL_tmp=="http://manhua.ali213.net"+"javascript:void(0);"){
				comics.preURL_tmp="";
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
