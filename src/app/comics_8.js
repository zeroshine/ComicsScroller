console.log("reader starts");
// var comics=comics || { };
comics.baseURL="http://new.comicvip.com/show/";

comics.pageURL="http://www.comicvip.com/html/";

comics.appendImage=function(index){
			console.log('appendImage');
			for(var i=0;i<this.pageMax;++i){
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
	return doc.querySelectorAll(".ch , #lch");
}

comics.getTitleName=function(doc){
	return doc.querySelector("body > table:nth-child(7) > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(1) > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(2) > font").textContent;
}

comics.setImages=function(index,doc){
	var script=doc.evaluate("//*[@id=\"Form1\"]/script/text()",doc,null,XPathResult.ANY_TYPE, null).iterateNext().textContent.split('eval')[0];
	eval(script);
	var ch = /.*ch\=(.*)/.exec(doc.URL)[1];
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
		ch = c;
	}			    
	ps=ss(c, 7, 3);
	this.pageMax=ps;
	var img=[];
	for(var i=0;i<this.pageMax;++i){
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
	this.images=img;
	this.appendImage(index);
};

module.exports = comics;
