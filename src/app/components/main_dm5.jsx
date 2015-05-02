var React = require('react');

var Comics=require('../comics_dm5.js');
var Echo=require('../echo');
var Mixins=require('../../Mixin/mymixin.jsx');

var ChapterAction=require('../../actions/chapterAction.js');
var ChapterStore=require('../../store/chapterStore.js');

var handler = function(details) {
  var isRefererSet = false;
  var headers = details.requestHeaders,
    blockingResponse = {};
  headers.push({
    name: "Referer",
    value: "http://www.manben.com/"
  });
  headers.push({
    name: "Cookie",
    value: "isAdult=1"
  })
  blockingResponse.requestHeaders = headers;
  return blockingResponse;
};

chrome.webRequest.onBeforeSendHeaders.addListener(handler, {urls: ["http://www.manben.com/*"]},['requestHeaders', 'blocking']);



var Main = React.createClass({
  
  mixins:[Mixins,Comics],  

  componentDidMount: function() {
    // ChapterStore.addListener("update",this._updateChapter);
    var params_str=window.location.search.substring(1);
    var params=params_str.split('&');
    this.site= /site\=(.*)/.exec(params[0])[1];
    this.pageURL=/chapter\=(.*)\/(\w*)\/$/.exec(params[1])[1];   
    this.chapterURL=this.baseURL+(/chapter\=(.*)$/.exec(params[1])[1]);  

    ChapterStore.addListener("scroll",this._updateInfor);
    var req=new XMLHttpRequest();
    req.open("GET",this.chapterURL);
    req.responseType="document";
    req.onload=function(){
      var doc=req.response;
      this.indexURL=doc.querySelector("#index_right > div.lan_kk2 > div:nth-child(1) > dl > dt.red_lj > a").href;
      this._getChromeStore(); 
    }.bind(this);
    req.send();
    // this._getChapter();
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
        item.payload=nl[i].href;
        if(item.payload===this.chapterURL){
          index=i;
          this._getImage(index,item.payload);
          item.isMarked=true;
          if(this.markedItems.indexOf(item.payload)>=0){
            this.markedItems.push(item.payload);
          }
        }
        item.text=nl[i].textContent;
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
    req.open("GET",url,true);
    req.responseType="document";
    req.withCredentials = true;
    req.onload=(function(index,req,self){
      return function(){
        self.setImages(index,req);
        if(!Echo.hadInited){
          Echo.init({
            offset: 2500,
            throttle: 200,
            unload: false,
            imgRender:  function(elem){
                var req=new XMLHttpRequest();
                req.open("GET",elem.getAttribute("data-echo"),true);
                req.withCredentials = true;
                req.onload=(function(elem){
                  return function(){
                    eval(req.response);
                    if (typeof (hd_c) != "undefined" && hd_c.length > 0 && typeof (isrevtt) != "undefined") {
                      elem.src=hd_c[0];
                    }else{
                      elem.src=d[0];
                    }
                    elem.removeAttribute('data-echo');
                    elem.removeAttribute('style');
                  }
                })(elem);
                req.send();
            }
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