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
				comics.setMaxHeight=false;
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
	    		comics.setMaxHeight=true;
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
			
			
			// comics.chapterId=/http\:\/\/manhua.ali213.net\/comic\/\d*\/(\d*).html/.exec(document.URL)[1];	
		}	
		

		comics.setImages=function(doc){
			var script=doc.evaluate("//*[@id=\"Form1\"]/script/text()",doc,null,XPathResult.ANY_TYPE, null).iterateNext().textContent.split('eval')[0];
			eval(script);
			
			comics.maxChapter=chs;
			console.log(comics.maxChapter);
			if(parseInt(doc.URL.split("=")[1])>1){
				comics.preURL_tmp=doc.URL.split("=")[0]+"="+(parseInt(doc.URL.split("=")[1])-1);
			}else{
				comics.preURL_tmp="";
				// comics.preChapter.style.display="none";
			}

			if(parseInt(doc.URL.split("=")[1])<comics.maxChapter){
				comics.nextURL_tmp=doc.URL.split("=")[0]+"="+(parseInt(doc.URL.split("=")[1])+1);
			}else{
				comics.nextURL_tmp="";
				// comics.nextChapter.style.display="none";
			}
			// comics.pageMax=doc.getElementById("pageindex").childElementCount;
			// comics.chapterId=/http\:\/\/manhua.ali213.net\/comic\/\d*\/(\d*).html/.exec(doc.URL)[1];
			
			// console.log(cs);
			var ch = /.*ch\=(.*)/.exec(doc.URL)[1];
			var titlename=doc.evaluate("//*[@id=\"Form1\"]/table[3]/tbody/tr/td[1]/b/font/text()[1]",doc,null,XPathResult.ANY_TYPE, null).iterateNext().textContent;
			var titlename=titlename.split(":[ ")[1];
			comics.titleInfor=titlename;
			
			if (ch.indexOf('#') > 0)
			    ch = ch.split('#')[0];
			var p = 1;
			var f = 50;
			if (ch.indexOf('-') > 0) {
			    p = parseInt(ch.split('-')[1]);
			    ch = ch.split('-')[0];
			}
			if (ch == '')
			    ch = 1;
			else
    			ch = parseInt(ch);
    		comics.chapterId=ch;
			var ss=function (a, b, c, d) {
    			var e = a.substring(b, b + c);
			    return d == null ? e.replace(/[a-z]*/gi, "") : e;
			};
			var nn = function(n) {
			    return n < 10 ? '00' + n : n < 100 ? '0' + n : n;
			};
			var mm = function (p) {
			    return (parseInt((p - 1) / 10) % 10) + (((p - 1) % 10) * 3)
			};
			
			var c="";
			var cc = cs.length;
			for (var j = 0; j < cc / f; j++) {
			    if (ss(cs, j * f, 4) == ch) {
			        c = ss(cs, j * f, f, f);
			        ci = j;
			        break;
			    }
			}
			if (c == '') {
			    c = ss(cs, cc - f, f);
			    ch = c
			}			    
			ps=ss(c, 7, 3);
			comics.pageMax=ps;
			var img=[];
			for(var i=0;i<comics.pageMax;++i){
			    var c="";
			    var cc = cs.length;
			    for (var j = 0; j < cc / f; j++) {
			        if (ss(cs, j * f, 4) == ch) {
			            c = ss(cs, j * f, f, f);
			            ci = j;
			            break;
			        }
			    }
			    if (c == '') {
			        c = ss(cs, cc - f, f);
			        ch = chs;
			    }
			    img[i]='http://img' + ss(c, 4, 2) + '.8comic.com/' + ss(c, 6, 1) + '/' + ti + '/' + ss(c, 0, 4) + '/' + nn(i+1) + '_' + ss(c, mm(i+1) + 10, 3, f) + '.jpg';
			}

			comics.images=img;
			comics.chapterId=ch;
			comics.titleInfor=titlename+"  /  "+"第"+comics.chapterId+"話 ";
			comics.chaptertxt.textContent=comics.titleInfor;
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
				img.setAttribute("data-pageMax",comics.pageMax);
				if(comics.setMaxHeight){
					img.style.maxHeight="92vh";
				}
				img.src="";
				img.className="comics_img";
				this.panel.appendChild(img);
			}	
		};
		// comics.nextURL=document.URL.split("=")[0]+"="+(parseInt(document.URL.split("=")[1])+1);
		comics.createItem();
		comics.setImages(document);
		if(parseInt(document.URL.split("=")[1])>1){
			comics.preURL_tmp=document.URL.split("=")[0]+"="+(parseInt(document.URL.split("=")[1])-1);
		}else{
			comics.preURL_tmp="";
			comics.preChapter.style.display="none";
		}

		if(parseInt(document.URL.split("=")[1])<comics.maxChapter){
			comics.nextURL_tmp=document.URL.split("=")[0]+"="+(parseInt(document.URL.split("=")[1])+1);
		}else{
			comics.nextURL_tmp="";
			comics.nextChapter.style.display="none";
		}
		comics.nextURL=comics.nextURL_tmp;
		console.log("nextURL "+comics.maxChapter);
		comics.preURL=comics.preURL_tmp;
		comics.appendImage();	
		echo.init({
	    	offset: 2500,
	    	throttle: 100,
	    	unload: false,
	    	update: function () {
	    		if(comics.nextURL!==""){
	    			var req=new XMLHttpRequest();
				    console.log(comics.nextURL);
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
