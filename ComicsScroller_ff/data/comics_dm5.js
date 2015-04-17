console.log("reader starts");
// var comics=comics || { };
comics.setImages=function(doc){
	comics.preChapter.style.display="none";
	var script1=/<script type\=\"text\/javascript\">(.*)reseturl/.exec(doc.head.innerHTML)[1];
	( new Function(script1+"comics.titleInfor=DM5_CTITLE.toString();comics.pageMax=DM5_IMAGE_COUNT;comics.chapterId=DM5_CID.toString();" ) )();  
	// eval(script1);
	// comics.titleInfor=DM5_CTITLE.toString();
	// comics.pageMax=DM5_IMAGE_COUNT;
	// comics.chapterId=DM5_CID.toString();
	var scriptURL=doc.evaluate("/html/head/script[10]",doc,null,XPathResult.ANY_TYPE,null).iterateNext().getAttribute('src');
	var nextURLnode=doc.evaluate("//*[@id=\"index_right\"]/div[2]/div[2]/span[2]/a",doc,null,XPathResult.ANY_TYPE,null).iterateNext();
	if(nextURLnode==null){
		comics.maxChapter=comics.chapterId;	
	}else{
		comics.nextURL_tmp=nextURLnode.getAttribute('href');
	}
	// console.log("next url "+comics.nextURL_tmp);
	// console.log("doc url "+doc.URL);
	var img=[];
	for(var i=0;i<comics.pageMax;++i){
		img[i]=doc.URL+"chapterfun.ashx?cid="+comics.chapterId+"&page="+(i+1)+"&key=&language=1";
	}
	comics.images=img;
	comics.appendImage();	
	echo.init({
		offset: 2500,
		throttle: 100,
		unload: false,
		update: function () {
			// console.log("chapterInview "+comics.chapterId);
			if(comics.chapterId!==comics.maxChapter){
				// console.log("update");
				  	var req=new XMLHttpRequest();
				req.open("GET",comics.nextURL_tmp,true);
				req.responseType="document";
				req.onload=function(){
						var doc=req.response;
						comics.setImages(doc);
				};
				req.send()	}
		},
		imgRender: function(elem){
			return (function(){
						var req=new XMLHttpRequest();
						req.open("GET",elem.getAttribute("data-echo"),true);
						req.onload=function(){
								return (function(){
									// eval(req.response);
									console.log(req.response);
									( new Function( req.response,"comics.hd_c=hd_c;comics.d=d;" ) )(); 
									// console.log(req.response);
									// elem.src=d[0];
									if (typeof (comics.hd_c) != "undefined" && comics.hd_c.length > 0) {
								   	    elem.src=comics.hd_c[0];
					  				}else{
						   	      		elem.src=comics.d[0];
					  				}
					             	elem.removeAttribute('data-echo');
								})(elem,req);
						};
						req.send();
						})(elem);
		},
		setInViewInfor: function(){
			var nodes = document.querySelectorAll('img[data-title]');    
			var oview={
				l: 0,
				t: (window.innerHeight || document.documentElement.clientHeight)*0.2,
				b: (window.innerHeight || document.documentElement.clientHeight),
				r: (window.innerWidth || document.documentElement.clientWidth)
			};
			for (var i = 0; i < nodes.length; i++) {
				var elem=nodes[i];
				if(echo.checkView(elem, oview)){
					// console.log("elem chapterId inview :"+elem.getAttribute("data-chapter")+"  chapterInview "+comics.chapterId);
					if(comics.chaptertxt.textContent!==elem.getAttribute("data-title")){
					//  console.log("set data-title "+elem.getAttribute("data-title"));
						comics.chaptertxt.textContent=elem.getAttribute("data-title");  
					}
					if(elem.getAttribute("data-chapter")!==comics.chapterIdInView){
						comics.nextURL=elem.getAttribute("data-nextURL");
						comics.preURL=elem.getAttribute("data-preURL");
						comics.chapterIdInView=elem.getAttribute("data-chapter");
						if(elem.getAttribute("data-chapter")==comics.maxChapter){
						  	comics.nextChapter.style.display="none";
						}else{
						   	comics.nextChapter.style.display="inline-block";
						}
					}
					return;
				}
			}
		}
	});
};

document.onreadystatechange = function () {
	if (document.readyState == "interactive") {				
		comics.maxChapter="";
		comics.createItem();
		comics.setImages(document);
		comics.nextURL=comics.nextURL_tmp;
		comics.chaptertxt.textContent=comics.titleInfor+"  第1/"+comics.pageMax+"頁";
		if(comics.chapterId==comics.maxChapter){
			comics.maxChapter=comics.chapterId;
			comics.nextChapter.style.display="none";
		}
		
	}
}
