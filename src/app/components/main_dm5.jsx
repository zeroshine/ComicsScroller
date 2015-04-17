var React = require('react');
var mui = require('material-ui');
var AppBar =mui.AppBar;
var AppCanvas=mui.AppCanvas;
var LeftNav=require('./app-left-nav.jsx');
var Menu = mui.Menu;
var ChapterMenu=require('./chapter-menu.jsx');  

var Comics=require('../comics_dm5.js');
var Echo=require('../echo');
var ChapterAction=require('../../actions/chapterAction.js');
var ChapterStore=require('../../store/chapterStore.js');

var params_str=window.location.search.substring(1);
var params=params_str.split('&');
var site= /site\=(.*)/.exec(params[0])[1];
var pageURL=/chapter\=(.*)\/(\w*)\/$/.exec(params[1])[1];   
var chapterURL=/chapter\=(.*)$/.exec(params[1])[1];  
var lastIndex;
// chrome.storage.sync.set({"test":"test"},function(){console.log("sync success")});
// chrome.webRequest.onBeforeRequest.addListener(
//         function(details) { console.log("request") },
//         {urls: ["<all_urls>"]},
//         ["blocking"]);
handler = function(details) {
  var isRefererSet = false;
  var headers = details.requestHeaders,
    blockingResponse = {};
  for (var i = 0, l = headers.length; i < l; ++i) {
    if (headers[i].name == 'Referer') {
      headers[i].value = "http://your-url.com/";
      isRefererSet = true;
      break;
    }
  }
  if (!isRefererSet) {
    headers.push({
      name: "Referer",
      value: "http://www.manben.com/"
    });
  }

  blockingResponse.requestHeaders = headers;
  return blockingResponse;
};

chrome.webRequest.onBeforeSendHeaders.addListener(handler, {urls: ["<all_urls>"]},['requestHeaders', 'blocking']);



var Main = React.createClass({
  
  getInitialState: function(){
    return {menuItems:[],selectedIndex:null,comicname:"",pageratio:"",chapter:""}
  },  

  componentDidMount: function() {
    // ChapterStore.addListener("update",this._updateChapter);
    ChapterStore.addListener("scroll",this._updateInfor);
    var req=new XMLHttpRequest();
    req.open("GET",Comics.baseURL+chapterURL);
    req.responseType="document";
    req.onload=function(){
      var doc=req.response;
      var indexURL=doc.querySelector("body > div.view_hd > div.view_logo2.bai_lj > a:nth-child(3)").href;
      chrome.storage.sync.get(params_str,function(items){
        this._getChapter(indexURL,items);
      }.bind(this)); 
    }.bind(this);
    req.send();
    // this._getChapter();
  },
  
  render: function() {
    var title="Comics Scroller";
    return (
      <AppCanvas predefinedLayout={1}>
        <AppBar title={title+"  "+this.state.comicname+"  "+this.state.chapter+"  "+this.state.pageratio} onMenuIconButtonTouchTap={this._onMenuIconButtonTouchTap} />
        <LeftNav menuItems={this.state.menuItems} selectedIndex={this.state.selectedIndex} isInitiallyOpen={false} ref="leftNav" onMenuItemClick={this._onMenuItemClick}/>
        <div id="comics_panel" />   
      </AppCanvas>
    );
  },

  _onMenuIconButtonTouchTap: function() {
    this.refs.leftNav.toggle();
  },

  _onMenuItemClick: function(e, index, item) {
    console.log(item.payload);
    var panel=document.getElementById("comics_panel");
    var menuItems=this._cloneMenuItems();
    if(this.markedItems.indexOf(menuItems[index].payload)===-1){
      menuItems[index].isMarked=true;
      this.markedItems.push(menuItems[index].payload);
      var obj={};
      obj[params_str]=this.markedItems;
      chrome.storage.sync.set(obj);
    }
    this.setState({menuItems:menuItems,selectedIndex:index,chapter:menuItems[index].text});
    if(index>0){
      Comics.setNextURL(this.state.menuItems[index-1]["payload"]);  
    }
    lastIndex=index;
    panel.innerHTML="";
    this._getImage(index,item.payload);
    if(!Echo.hadInited){
          // console.log("echo init");
      Echo.init({
        offsetBottom: 2500,
        throttle: 50,
        unload: false
      }); 
    }else{
      Echo.run();
          // console.log("run");
    }    
  },

  _getChapter: function(indexURL , storeItem){    
    this.markedItems= (storeItem[params_str]===undefined)? [] : storeItem[params_str];    
    var creq=new XMLHttpRequest();
    creq.open("GET",indexURL,true);
    console.log(indexURL);
    creq.responseType="document";
    creq.withCredentials = true;
    creq.onload=function(){
      var doc=creq.response;
      var nl = Comics.getChapter(doc);
      var array=[];
      var index=0;
      for(var i=0;i<nl.length;++i){
        var item={};
        item["payload"]=nl[i].getAttribute("href");
        if(item["payload"]===chapterURL){
          index=i;
          item["isMarked"]=true;
          if(this.markedItems.indexOf(chapterURL)===-1){
            this.markedItems.push(chapterURL);
            var obj={};
            obj[params_str]=this.markedItems;
            chrome.storage.sync.set(obj);
          }
        }
        item["text"]=nl[i].textContent;
        if(this.markedItems.indexOf(item.payload)>=0){
          item["isMarked"]=true;  
        }
        array.push(item);
      }
      Comics.setMinChapterIndex(array.length-1);
      if(index>0){
        Comics.setNextURL(array[index-1]["payload"]);  
      }
      this.setState({menuItems:array,selectedIndex:index,chapter:array[index].text,comicname:Comics.getTitleName(doc)});
      lastIndex=index;
      this._getImage(index,chapterURL);
    }.bind(this);
    creq.send();
  },

  _getImage: function(index,url){
    var req=new XMLHttpRequest();
    console.log(Comics.baseURL+url);
    req.open("GET",Comics.baseURL+url,true);
    req.responseType="document";
    req.withCredentials = true;
    req.onload=(function(index,req,Comics){
      return function(){
        Comics.setImages(index,req);
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
                    if (typeof (hd_c) != "undefined" && hd_c.length > 0) {
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
    })(index,req,Comics);
    req.send();
  },

  markedItems: [],

  _cloneMenuItems: function(){
    var menuItems=[];
    for(var i=0;i<this.state.menuItems.length;++i){
      var item={};
      item.text=this.state.menuItems[i].text;
      item.payload=this.state.menuItems[i].payload;
      item.isMarked=this.state.menuItems[i].isMarked;
      menuItems.push(item);
    }
    return menuItems;
  },

  _updateInfor: function(num,pageratio){
    var n=parseInt(num);
    if(n!==this.state.selectedIndex){      
      var menuItems=this._cloneMenuItems();
      if(this.markedItems.indexOf(menuItems[n].payload)===-1){
        menuItems[n].isMarked=true;
        this.markedItems.push(menuItems[n].payload);
        var obj={};
        obj[params_str]=this.markedItems;
        chrome.storage.sync.set(obj);
      }      
      this.setState({menuItems:menuItems,selectedIndex: n,chapter:this.state.menuItems[n].text});
    }
    if(typeof(this.state.menuItems[n].num)==="undefined"&&pageratio!==this.state.menuItems[n].number){
      var menuItems=this._cloneMenuItems();
      menuItems[n].number=pageratio;
      this.setState({menuItems:menuItems,pageratio:pageratio});
    }
    if(n===lastIndex){
      if(lastIndex>0){
        // console.log("_updateChapter");
        this._getImage(--lastIndex,this.state.menuItems[lastIndex].payload);
      }        
    }
  }

});

module.exports = Main;