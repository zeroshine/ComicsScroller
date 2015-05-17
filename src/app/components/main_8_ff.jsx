var React = require('react');
var Comics=require('../comics_8.js');
var Echo=require('../echo');
var Mixins=require('../../Mixin/mymixin.jsx');
var StoreMixin=require('../../Mixin/storemixin_ff.jsx');

var ChapterAction=require('../../actions/chapterAction.js');
var ChapterStore=require('../../store/chapterStore.js');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var hasAddedListener=false;

var Main = React.createClass({
  mixins:[PureRenderMixin,StoreMixin,Mixins,Comics],

  componentDidMount: function() {
    // ChapterStore.addListener("update",this._updateChapter);
    this.handleUrlHash();
    this._getImage(-1,this.chapterNum);
    this._getStore();
    if(!hasAddedListener){
      ChapterStore.addListener("scroll",this._updateInfor);
      window.addEventListener("hashchange",function(e){
        this.handleUrlHash();
      }.bind(this));
      hasAddedListener=true;
    }
  },
  _onMenuItemClick: function(e, index, item) {
    var panel=document.getElementById("comics_panel");
    var menuItems=this._cloneMenuItems({isMarked:true,text:true});
    if(!this.markedItems.has(menuItems[index].payload)){
      menuItems[index].isMarked=true;
      this.markedItems=this.markedItems.add(menuItems[index].payload);      
    }
    console.log(menuItems);   
    this.setState({
      menuItems:menuItems,
      rightDisable:index===0,
      leftDisable:index===this.state.menuItems.length-1,
      selectedIndex:index,
      chapter:menuItems[index].text},
      function(){this._saveStoreReaded()}.bind(this));
    this.lastIndex=index;
    // panel.innerHTML="";
    // this._getImage(index,item.payload);
    document.title=this.title+" "+this.state.menuItems[index].text;
    this._updateHash(menuItems[index].payload,'');
    // if(!Echo.hadInited){
    //   Echo.init(); 
    // }else{
    //   Echo.run();
    // }    
  },
  _getChapter: function(){
    var creq=new XMLHttpRequest();
    creq.open("GET",this.indexURL,true);
    creq.responseType="document";
    creq.withCredentials = true;
    creq.onload=function(){
      var doc=creq.response;
      var nl = this.getChapter(doc);
      var array=[];
      var index=-1;
      var item={};
      item.payload= this.getChapterUrl(nl[nl.length-2].getAttribute("onclick"));
      item.text=nl[nl.length-1].textContent;
      if(item.payload===this.baseURL+this.prefixURL+this.chapterNum&&index===-1){
        index=0;
        this.setImageIndex(index);
        item.isMarked=true;
        if(!this.markedItems.has(item.payload)){
          this.markedItems=this.markedItems.add(item.payload);
        }
      }
      if(this.markedItems.has(item.payload)){
        item.isMarked=true;  
      }
      array.push(item);
      for(var i=nl.length-3;i>=0;--i){
        var item={};
        item.payload=this.getChapterUrl(nl[i].getAttribute("onclick"));
        if((item.payload===this.baseURL+this.prefixURL+this.chapterNum)&&index===-1){
          index=nl.length-i-2;
          this.setImageIndex(index);
          item.isMarked=true;
          if(!this.markedItems.has(item.payload)){
            this.markedItems=this.markedItems.add(item.payload);
          }
        }
        item.text=nl[i].textContent.trim();
        if(this.markedItems.has(item.payload)){
          item.isMarked=true;  
        }
        array.push(item);
      }
      this.title=this.getTitleName(doc);
      this.iconUrl=this.getCoverImg(doc);
      document.title=this.title+" "+array[index].text;
      console.log("index",index);
      this.setState({
        menuItems:array,
        selectedIndex:index,
        chapter:array[index].text,
        rightDisable:index===0,
        leftDisable:index===array.length-1,
        comicname:this.title},
        function(){this._saveStoreReaded();}.bind(this));
      this.lastIndex=index;
      
    }.bind(this);
    creq.send();
  },

  _getImage: function(index,url){
    var req=new XMLHttpRequest();
    req.open("GET",this.baseURL+this.prefixURL+url,true);
    req.responseType="document";
    req.withCredentials = true;
    req.onload=(function(index,req,self){
      return function(){
        // console.log(req.response);
        var doc=req.response;
        self.setImages(index, doc);
        
      }
    })(index,req,this);
    req.send();
  },

  _updateHash:function(url,type){
    var chapterHash="chapter\/"+Comics.regex.exec(url)[1];
    var str=window.location.hash;
    str=str.replace(/chapter\/.*$/,chapterHash)+type;
    window.location.hash=str;
  },

  appendImage:function(index){
    if(index===-1){
      index=this.chapterUpdateIndex;
      this.chapterUpdateIndex=-2;
    }
    for(var i=0;i<this.pageMax;++i){
      var img=new Image();
      img.src="../img/Transparent.gif";
      img.setAttribute("data-echo",this.images[i]);
      img.setAttribute("data-num",i+1);
      img.setAttribute("data-chapter",index);
      img.style.width="900px";
      img.style.height="1300px";
      img.style.borderWidth="1px";
      img.style.borderColor="white";
      img.style.borderStyle="solid";
      img.setAttribute("data-pageMax",this.pageMax);
      img.className="comics_img";
      document.getElementById("comics_panel").appendChild(img);
    }
    var chapterEnd=document.createElement("div");
    chapterEnd.className="comics_img_end";
    chapterEnd.textContent="本話結束";
    document.getElementById("comics_panel").appendChild(chapterEnd);
    if(!Echo.hadInited){
      Echo.init(); 
    }else{
      Echo.render();
    }
  }

});

module.exports = Main;