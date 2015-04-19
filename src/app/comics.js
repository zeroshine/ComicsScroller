var comics=comics || { };


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
	    			imglist[i].style.maxHeight="none";
	    		}
			});

			comics.maxheightbutton=document.createElement("button");
			comics.maxheightbutton.className="comics_button";
			comics.maxheightbutton.textContent="符合頁高";
			comics.maxheightbutton.addEventListener("click", function(){
	    		var imglist=document.getElementsByClassName("comics_img");
	    		for(var i=0; i< imglist.length;++i){
	    			imglist[i].style.maxHeight="92vh";
	    		}
			});

			comics.buttonplace=document.createElement("div");
			comics.buttonplace.id="comics_button_place";

			comics.nextChapter=document.createElement("button");
			comics.nextChapter.className="comics_button";
			comics.nextChapter.textContent="下一話";
			comics.nextChapter.addEventListener("click", function(){
					window.location=comics.nextURL;
			});

			comics.preChapter=document.createElement("button");
			comics.preChapter.className="comics_button";
			comics.preChapter.textContent="上一話";
			comics.preChapter.addEventListener("click", function(){
					window.location=comics.preURL;
			});

			

			comics.buttonplace.appendChild(comics.preChapter);
			comics.buttonplace.appendChild(comics.nextChapter);
			
			comics.buttonplace.appendChild(comics.maxheightbutton);
			comics.buttonplace.appendChild(comics.maxwidthbutton);

			comics.titlebar.appendChild(comics.chaptertxt);
			comics.titlebar.appendChild(comics.buttonplace);
			comics.panel.appendChild(comics.titlebar);
			
			// document.body.style.display="none";
						
};

comics.appendImage=function(){
			console.log('appendImage');
			for(var i=0;i<comics.pageMax;++i){
				var img=new Image();
				// console.log(comics.images[i]);
				img.setAttribute("data-echo",comics.images[i]);
				img.setAttribute("data-num",i);
				img.setAttribute("data-title",comics.titleInfor+" 第"+(i+1)+"/"+comics.pageMax+"頁");
				img.setAttribute("data-chapter",comics.chapterId);
				img.setAttribute("data-pageMax",comics.pageMax);
				img.setAttribute("data-nextURL",comics.nextURL_tmp);
				img.setAttribute("data-preURL",comics.preURL_tmp);
				if(comics.setMaxHeight||localStorage["mode"]=="page_high"){
					img.style.maxHeight="92vh";
				}
				img.src="";
				img.className="comics_img";
				// console.log(comics.titleInfor+" 第"+(i+1)+"/"+comics.pageMax+"頁");
				comics.panel.appendChild(img);
			}
};
comics.chapterIdInView="";