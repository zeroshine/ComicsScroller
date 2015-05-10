/** In this file, we create a React component which incorporates components provided by material-ui */

var React = require('react');
 

var Comics=require('../comics_8.js');
var Echo=require('../echo');
var Mixins=require('../../Mixin/mymixin.jsx');
var StoreMixin=require('../../Mixin/storemixin.jsx');

var ChapterAction=require('../../actions/chapterAction.js');
var ChapterStore=require('../../store/chapterStore.js');

var hasAddedListener=false;

var Main = React.createClass({
  mixins:[StoreMixin,Mixins,Comics],

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
    this.setState({menuItems:menuItems,selectedIndex:index,chapter:menuItems[index].text},function(){this._saveStoreReaded()}.bind(this));
    this.lastIndex=index;
    // panel.innerHTML="";
    // this._getImage(index,item.payload);
    document.title=this.title+" "+this.state.menuItems[index].text;
    this._updateHash(menuItems[index].payload,'');
    if(!Echo.hadInited){
      Echo.init(); 
    }else{
      Echo.run();
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
      this.setState({menuItems:array,selectedIndex:index,chapter:array[index].text,comicname:this.title},function(){this._saveStoreReaded();}.bind(this));
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
        if(!Echo.hadInited){
          Echo.init(); 
        }else{
          Echo.run();
        }
      }
    })(index,req,this);
    req.send();
  },

  _updateHash:function(url,type){
    var chapterHash="chapter\/"+Comics.regex.exec(url)[1];
    var str=window.location.hash;
    str=str.replace(/chapter\/.*$/,chapterHash)+type;
    window.location.hash=str;
  }
  
});

module.exports = Main;