console.log("reader starts");
// var comics=comics || { };
var comics={};

comics.baseURL="http://www.158c.com";

comics.chapterIdInView="";

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
	return doc.querySelectorAll(".detail_body_right > div:nth-child(1) > * > ul > li > a");
}

comics.getTitleName=function(doc){
	return doc.querySelector("body > div.newmh_center > div.mh_comic_body > div.mh_comic_con > div.mh_comic_con_right > div > div.detail_body_right_top_center_con>a").textContent;
}

comics.setImages=function(index,doc){
	eval(doc.head.innerHTML.replace(/[\r\n]/g,'@@@').match(/(eval.*?)\/*@@@/)[1]);
	// var titlename=doc.evaluate("//*[@id=\"enjoy_b\"]/div[1]/div[1]/h1/a",doc,null,XPathResult.ANY_TYPE, null).iterateNext().text;
	// comics.nextURL_tmp=comics.baseURL+doc.evaluate("//*[@id=\"enjoy_b\"]/div[2]/ul/li[6]/a",doc,null,XPathResult.ANY_TYPE, null).iterateNext().getAttribute("href");
	// console.log("new nextURL: "+comics.nextURL_tmp);
	// comics.preURL_tmp=comics.baseURL+doc.evaluate("//*[@id=\"enjoy_b\"]/div[2]/ul/li[2]/a",doc,null,XPathResult.ANY_TYPE, null).iterateNext().getAttribute("href");
	// var chapterInfor=doc.evaluate("//*[@id=\"enjoy_b\"]/div[1]/div[1]/h2/a",doc,null,XPathResult.ANY_TYPE, null).iterateNext().text;
	// comics.titleInfor=titlename+" / "+chapterInfor;
	// comics.chapterId=currentchapter.toString();
	// if(comics.nextURL_tmp=="javascript:void(0);"){
	// 	comics.maxChapter=comics.chapterId;
	// }
	// if(comics.preURL_tmp=="javascript:void(0);"){
	// 	comics.minChapter_tmp=comics.chapterId;
	// }
	// var img_domain='';
	comics.pageMax=pages;
	console.log(doc.URL);
	var verifystr=/http\:\/\/www\.158c\.com\/comic\/\d*\/(\d*).html/.exec(doc.URL)[1];
	if (verifystr>144681){
		img_domain="http://mhimg1.158c.com";
	}else{
		img_domain="http://mhimg.158c.com";
	}
	var imgs =[]; 
	for(var i=0;i<comics.pageMax;i++){
		imgs[i]=img_domain+imgpath+i+".jpg";
	}
	this.images=imgs;	
	this.appendImage(index);
};

module.exports = comics;
