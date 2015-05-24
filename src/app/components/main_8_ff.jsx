var React = require('react');
var Immutable = require('immutable');
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
      item=Immutable.Map(item);
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
        item=Immutable.Map(item);
        array.push(item);
      }
      this.title=this.getTitleName(doc);
      this.iconUrl=this.getCoverImg(doc);
      document.title=this.title+" "+array[index].get('text');
      console.log("index",index);
      this.setState({
        menuItems:Immutable.List(array),
        selectedIndex:index,
        chapter:array[index].get("text"),
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
    var comics_panel=document.getElementById("comics_panel");
    if(index===-1){
      index=this.chapterUpdateIndex;
      this.chapterUpdateIndex=-2;
    }
    for(var i=0;i<this.pageMax;++i){
      var img=document.createElement('img');
      img.src="http://zeroshine.github.io/ComicsScroller/img/Transparent.gif";
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
      comics_panel.appendChild(img);
    }
    Echo.nodes=comics_panel.children;
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