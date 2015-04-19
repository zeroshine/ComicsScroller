console.log("reader starts");

comics.baseURL="http://www.manben.com";

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
	var nl=doc.querySelectorAll(".nr6.lan2>li>.tg");
	return nl;
}

comics.getTitleName=function(doc){
	return doc.querySelector(".inbt_title_h2").textContent;
}

comics.setImages=function(index,xhr){
	var doc=xhr.response;
	var script1=/<script type\=\"text\/javascript\">(.*)reseturl/.exec(doc.head.innerHTML)[1];
	eval(script1);
	comics.pageMax=DM5_IMAGE_COUNT;
	var img=[];
	for(var i=0;i<comics.pageMax;++i){
		img[i]=doc.URL+"chapterfun.ashx?cid="+DM5_CID.toString()+"&page="+(i+1)+"&key=&language=1";
	}
	comics.images=img;
	comics.appendImage(index);		
};

module.exports=comics;

