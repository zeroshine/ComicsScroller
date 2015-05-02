/** In this file, we create a React component which incorporates components provided by material-ui */

var React = require('react');
 

var Comics=require('../comics_8.js');
var Echo=require('../echo');
var Mixins=require('../../Mixin/mymixin.jsx');

var ChapterAction=require('../../actions/chapterAction.js');
var ChapterStore=require('../../store/chapterStore.js');

var Main = React.createClass({
  mixins:[Mixins,Comics],

  componentDidMount: function() {
    // ChapterStore.addListener("update",this._updateChapter);
    var params_str=window.location.search.substring(1);
    var params=params_str.split('&');
    this.site= /site\=(.*)/.exec(params[0])[1];
    this.pageURL=/chapter\=.*-(\d*\.html)\?/.exec(params[1])[1];   
    this.chapterNum=/chapter\=.*\?ch\=(\d*)$/.exec(params[1])[1];
    this.prefixURL=/chapter\=(.*\?ch\=)\d*$/.exec(params[1])[1];;  
    this.indexURL=this.comicspageURL+this.pageURL;

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
      var item={};
      item.payload= this.getChapterUrl(nl[nl.length-2].getAttribute("onclick"));
      item.text=nl[nl.length-1].textContent;
      if(item.payload===this.baseURL+this.prefixURL+this.chapterNum){
        index=0;
        item.isMarked=true;
        this._getImage(index,this.chapterNum);
        if(this.markedItems.indexOf(item.payload)===-1){
          this.markedItems.push(item.payload);
          this._saveChromeStoreReaded();
        }
      }
      if(this.markedItems.indexOf(item.payload)>=0){
        item.isMarked=true;  
      }
      array.push(item);
      for(var i=nl.length-3;i>=0;--i){
        var item={};
        item.payload=this.getChapterUrl(nl[i].getAttribute("onclick"));
        if(item.payload===this.baseURL+this.prefixURL+this.chapterNum){
          index=nl.length-i-2;
          this._getImage(index,this.chapterNum);
          item.isMarked=true;
          if(this.markedItems.indexOf(item.payload)>=0){
            this.markedItems.push(item.payload);
          }
        }
        item.text=nl[i].textContent.trim();
        if(this.markedItems.indexOf(item.payload)>=0){
          item.isMarked=true;  
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
    req.open("GET",this.baseURL+this.prefixURL+url,true);
    req.responseType="document";
    req.withCredentials = true;
    req.onload=(function(index,req,self){
      return function(){
        // console.log(req.response);
        var doc=req.response;
        self.setImages(index, doc);
        if(!Echo.hadInited){
          Echo.init({
            offset: 2500,
            throttle: 50,
            unload: false
          }); 
        }else{
          Echo.run();
        }
      }
    })(index,req,this);
    req.send();
  }  
});

module.exports = Main;