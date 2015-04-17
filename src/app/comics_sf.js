console.log("reader starts");

var comics={};

comics.baseURL="http://comic.sfacg.com";

comics.chapterArray=[];

comics.nowChapterIndex=-1;

comics.appendImage=function(index){
			console.log('appendImage');
			for(var i=0;i<comics.pageMax;++i){
				var img=new Image();
				// console.log(comics.images[i]);
				img.setAttribute("data-echo",comics.images[i]);
				img.setAttribute("data-num",i+1);
				// img.setAttribute("data-title",comics.titleInfor+" 第"+(i+1)+"/"+comics.pageMax+"頁");
				img.setAttribute("data-chapter",index);
				img.style.width="900px";
				img.style.height="1300px";
				img.setAttribute("data-pageMax",this.pageMax);
				// img.setAttribute("data-nextURL",comics.nextURL_tmp);
				// img.setAttribute("data-preURL",comics.preURL_tmp);
				if(comics.setMaxHeight||localStorage["mode"]=="page_high"){
					img.style.maxHeight="92vh";
				}
				img.src="";
				img.className="comics_img";
				// console.log(comics.titleInfor+" 第"+(i+1)+"/"+comics.pageMax+"頁");
				document.getElementById("comics_panel").appendChild(img);
			}
			var chapterend=document.createElement("div");
			chapterend.style.width="100%";
			chapterend.style.height="50px";
			chapterend.style.marginBottom="100px";
			chapterend.style.borderBottom="3px solid white";
			document.getElementById("comics_panel").appendChild(chapterend);
};

comics.setMinChapterIndex=function(min){
	this.minChapterIndex=min;	
};

comics.setNowChapterIndex=function(){
	this.nowChapterIndex=index;
}

comics.setNextURL=function(url){
	this.nextURL=url;
};

comics.getChapter=function(doc){
	var nl=doc.querySelectorAll(".serialise_list>li>a");
	return nl;
}

comics.getTitleName=function(doc){
	return doc.querySelector("body > table:nth-child(8) > tbody > tr > td:nth-child(1) > table:nth-child(2) > tbody > tr > td > h1 > b").textContent;
}

comics.setImages=function(index,xhr){
		eval(xhr.response);
		// comics.titleInfor=comicName+" / 第"+comics.chapterId+"話 ";		
		var name = "picHost=";
		var picHost= hosts[0];
    	var img =[]; 
		this.pageMax=picCount;
		for(var i=0;i<comics.pageMax;i++){
			img[i]=picHost+picAy[i];
		}
		this.images=img;
		this.appendImage(index);		 
};

module.exports = comics;
// document.onreadystatechange = function () {
// 	if (document.readyState == "complete") {
// 		comics.createItem();
// 		document.body.appendChild(comics.panel);
// 		var req=new XMLHttpRequest();
// 		req.open("GET",comics.baseURL+comics.nowchapter,true);
// 		req.responseType="document";
// 		req.withCredentials = true;
// 	    // req.setDisableHeaderCheck(true);
// 	    req.onload=function(){
//         	var doc=req.response;
// 		    comics.setImages(doc);
// 		    // comics.appendImage();
// 		};
// 		req.send();
// 		// comics.setImages(document);
		
// 	}
// }
