/** In this file, we create a React component which incorporates components provided by material-ui */

var React = require('react');

var Comics=require('../comics_sf.js');
var Echo=require('../echo');
var Mixins=require('../../Mixin/mymixin.jsx');


var ChapterAction=require('../../actions/chapterAction.js');
var ChapterStore=require('../../store/chapterStore.js');

var Main = React.createClass({
  
  mixins: [Mixins,Comics], 

  componentDidMount: function() {
    // ChapterStore.addListener("update",this._updateChapter);
    var params_str=window.location.search.substring(1);
    var params=params_str.split('&');
    this.site= /site\=(.*)/.exec(params[0])[1];
    this.pageURL=/chapter\=(\/HTML\/\w*\/)/.exec(params[1])[1];   
    this.chapterURL=this.baseURL+(/chapter\=(.*)$/.exec(params[1])[1]);
    this.indexURL=this.baseURL+this.pageURL;

    ChapterStore.addListener("scroll",this._updateInfor);
    this._getChromeStore();
  },
  _onMenuItemClick: function(e, index, item) {
    var panel=document.getElementById("comics_panel");
    var menuItems=this._cloneMenuItems({isMarked:true,text:true});
    if(this.markedItems.indexOf(menuItems[index].payload)===-1){
      menuItems[index].isMarked=true;
      this.markedItems.push(menuItems[index].payload);
    }   
    this.setState({menuItems:menuItems,selectedIndex:index,chapter:menuItems[index].text},function(){this._saveChromeStoreReaded()}.bind(this));
    this.lastIndex=index;
    panel.innerHTML="";
    this._getImage(index,item.payload);
    if(!Echo.hadInited){
      Echo.init({
        offsetBottom: 2500,
        throttle: 50,
        unload: false
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
      this.title=this.getTitleName(doc);
      this.iconUrl=this.getCoverImg(doc);
      var array=[];
      var index=0;
      for(var i=0;i<nl.length;++i){
        var item={};
        item["payload"]=nl[i].href;
        if(item["payload"]===this.chapterURL){
          index=i;
          this._getImage(index,this.chapterURL);
          item["isMarked"]=true;
          if(this.markedItems.indexOf(this.chapterURL)===-1){
            this.markedItems.push(this.chapterURL);
          }
        }
        item["text"]=nl[i].textContent;
        if(this.markedItems.indexOf(item.payload)>=0){
          item["isMarked"]=true;  
        }
        array.push(item);
      }
      this.setState({menuItems:array,selectedIndex:index,chapter:array[index].text,comicname:this.getTitleName(doc)},function(){this._saveChromeStoreReaded();}.bind(this));
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
            self.setImages(index,this);
            if(!Echo.hadInited){
              // console.log("echo init");
              Echo.init({
                offset: 2500,
                throttle: 50,
                unload: false
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
  }
  
});

module.exports = Main;