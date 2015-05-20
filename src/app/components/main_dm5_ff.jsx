var React = require('react');
var Immutable = require('immutable');
var Comics=require('../comics_dm5.js');
var Echo=require('../echo');
var Mixins=require('../../Mixin/mymixin.jsx');
var StoreMixin=require('../../Mixin/storemixin.jsx');
var ChapterAction=require('../../actions/chapterAction.js');
var ChapterStore=require('../../store/chapterStore.js');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var hasAddedListener=false;


var Main = React.createClass({
  
  mixins:[PureRenderMixin,StoreMixin,Mixins,Comics],  
  componentDidMount: function() {
    // ChapterStore.addListener("update",this._updateChapter);
    this.handleUrlHash();
    this._getImage(-1,this.chapterURL);
    var req=new XMLHttpRequest();
    req.open("GET",this.chapterURL);
    req.responseType="document";
    req.onload=function(){
      var doc=req.response;
      this.indexURL=doc.querySelector("#index_right > div.lan_kk2 > div:nth-child(1) > dl > dt.red_lj > a").href;
      this._getStore(); 
    }.bind(this);
    req.send();

    if(!hasAddedListener){
      ChapterStore.addListener("scroll",this._updateInfor);
      window.addEventListener("hashchange",function(e){
        this.handleUrlHash();
      }.bind(this));
      hasAddedListener=true;
    }
    // this._getChapter();
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
      for(var i=0;i<nl.length;++i){
        var item={};
        item.payload=nl[i].href;
        if(item.payload===this.chapterURL&&index===-1){
          index=i;
          this.setImageIndex(index);
          item.isMarked=true;
          if(!this.markedItems.has(item.payload)){
            this.markedItems=this.markedItems.add(item.payload);
          }
        }
        item.text=nl[i].textContent;
        if(this.markedItems.has(item.payload)){
          item.isMarked=true;  
        }
        item=Immutable.Map(item);
        array.push(item);
      }
      this.title=this.getTitleName(doc);
      this.iconUrl=this.getCoverImg(doc);
      document.title=this.title+" "+array[index].get('text');
      this.setState({
        menuItems:Immutable.List(array),
        selectedIndex:index,
        rightDisable:index===0,
        leftDisable:index===array.length-1,
        chapter:array[index].get('text'),
        comicname:this.title},
        function(){this._saveStoreReaded();}.bind(this));
      this.lastIndex=index;
    }.bind(this);
    creq.send();
  },

  _getImage: function(index,url){
    var req=new XMLHttpRequest();
    req.open("GET",url,true);
    req.responseType="document";
    req.withCredentials = true;
    // this.echo=Echo;
    req.onload=(function(index,req,self){
      return function(){
        self.setImages(index,req);
        
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
      comics_panel.appendChild(img);
    }
    Echo.nodes=comics_panel.children;
    var chapterEnd=document.createElement("div");
    chapterEnd.className="comics_img_end";
    chapterEnd.textContent="本話結束";
    comics_panel.appendChild(chapterEnd);
    // Echo.nodes.concat(comics_panel.children);
    if(!Echo.hadInited){
      Echo.init({
        imgRender:function(elem){
          var req=new XMLHttpRequest();
          req.open("GET",elem.getAttribute("data-echo"),true);
          req.withCredentials = true;
          req.onload=(function(elem,req){
            return function(){
              eval(req.response);
              if (typeof (hd_c) != "undefined" && hd_c.length > 0 && typeof (isrevtt) != "undefined") {
                elem.src=hd_c[0];
              }else{
                elem.src=d[0];
              }
              elem.removeAttribute('data-echo');
            }
          })(elem,req);
          req.send();
        }
      });
    }else{
      Echo.render();
    }
  }
});

module.exports = Main;