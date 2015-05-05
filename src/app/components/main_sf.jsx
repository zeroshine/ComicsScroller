/** In this file, we create a React component which incorporates components provided by material-ui */

var React = require('react');

var Comics=require('../comics_sf.js');
var Echo=require('../echo');
var Mixins=require('../../Mixin/mymixin.jsx');


var ChapterAction=require('../../actions/chapterAction.js');
var ChapterStore=require('../../store/chapterStore.js');


var hasAddedListener=false;

var Main = React.createClass({
  
  mixins: [Mixins,Comics], 

  componentDidMount: function() {
    // ChapterStore.addListener("update",this._updateChapter);
    this.handleUrlHash();
    this._getImage(-1,this.chapterURL);
    this._getChromeStore();
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
    this.setState({menuItems:menuItems,selectedIndex:index,chapter:menuItems[index].text},function(){this._saveChromeStoreReaded()}.bind(this));
    this.lastIndex=index;
    // panel.innerHTML="";
    // this._getImage(index,item.payload);
    document.title=this.title+" "+this.state.menuItems[index].text;
    this._updateHash(menuItems[index].payload,'');
    if(!Echo.hadInited){
      Echo.init({
        offsetBottom: 2500,
        throttle: 200,
        unload: true
      }); 
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
      for(var i=0;i<nl.length;++i){
        var item={};
        item.payload=nl[i].href;
        // console.log(nl[i].href,this.chapterURL);
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
        array.push(item);
      }
      this.title=this.getTitleName(doc);
      this.iconUrl=this.getCoverImg(doc);
      document.title=this.title+" "+array[index].text;
      this.setState({menuItems:array,selectedIndex:index,chapter:array[index].text,comicname:this.title},function(){this._saveChromeStoreReaded();}.bind(this));
      this.lastIndex=index;      
    }.bind(this);
    creq.send();
  },


  _getImage: function(index,url){
    var req=new XMLHttpRequest();
    req.open("GET",url,true);
    req.responseType="document";
    req.withCredentials = true;
    req.onload=(function(index,req,self){
      return function(){
        var doc=req.response;
        var scriptURL=/src=\"(\/Utility.*\.js)\">/.exec(doc.head.innerHTML)[1]; 
        var xhr = new XMLHttpRequest();
        xhr.open("GET",self.baseURL+scriptURL,true);
        xhr.onload=(function(index,xhr,self){
          return function(){
            self.setImages(index,xhr);
            if(!Echo.hadInited){
              // console.log("echo init");
              Echo.init({
                offset: 2500,
                throttle: 200,
                unload: true
              }); 
            }else{
              Echo.run();
              // console.log("run");
            }
          }
        })(index,xhr,self);
        xhr.send();
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