console.log("reader starts");
// var comics=comics || { };
document.onreadystatechange = function () {
	if (document.readyState == "interactive") {		
		comics.setImages=function(doc){
			
			var script=doc.evaluate("//*[@id=\"Form1\"]/script/text()",doc,null,XPathResult.ANY_TYPE, null).iterateNext().textContent.split('eval')[0];
			eval(script);
			
			comics.maxChapter=chs;
			console.log(comics.maxChapter);
			if(parseInt(doc.URL.split("=")[1])>1){
				comics.preURL_tmp=doc.URL.split("=")[0]+"="+(parseInt(doc.URL.split("=")[1])-1);
			}else{
				comics.preURL_tmp="";
			}

			if(parseInt(doc.URL.split("=")[1])<comics.maxChapter){
				comics.nextURL_tmp=doc.URL.split("=")[0]+"="+(parseInt(doc.URL.split("=")[1])+1);
			}else{
				comics.nextURL_tmp="";
			}
			
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
			comics.chaptertxt.textContent=comics.titleInfor+"第1/"+comics.pageMax+"頁";
		};		
		
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
				    req.open("GET",comics.nextURL,true);
				    req.responseType="document";
				    req.onload=function(){
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
