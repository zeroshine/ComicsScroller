/** In this file, we create a React component which incorporates components provided by material-ui */

var React = require('react');
var mui = require('material-ui');
var AppBar =mui.AppBar;
var AppCanvas=mui.AppCanvas;
var LeftNav=require('./app-left-nav.jsx');
var Menu = mui.Menu;
var ChapterMenu=require('./chapter-menu.jsx');  

var Comics=require('../comics_8.js');
var Echo=require('../echo');
var ChapterAction=require('../../actions/chapterAction.js');
var ChapterStore=require('../../store/chapterStore.js');

var params_str=window.location.search.substring(1);
var params=params_str.split('&');
var pageURL=/chapter\=.*-(\d*\.html)\?/.exec(params[1])[1];   
var chapterNum=/chapter\=.*\?ch\=(\d*)$/.exec(params[1])[1];
var prefixURL=/chapter\=(.*\?ch\=)\d*$/.exec(params[1])[1];;  
var lastIndex;

var Main = React.createClass({
  
  getInitialState: function(){
    return {menuItems:[],selectedIndex:null,comicname:"",pageratio:"",chapter:""}
  },  

  componentDidMount: function() {
    // ChapterStore.addListener("update",this._updateChapter);
    ChapterStore.addListener("scroll",this._updateInfor);
    chrome.storage.sync.get(params_str,function(items){
      this._getChapter(items);
    }.bind(this));
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
    this._getImage(index,prefixURL+item.payload);
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

  _getChapter: function(storeItem){
    console.log(Comics.pageURL+pageURL);    
    this.markedItems= (storeItem[params_str]===undefined)? [] : storeItem[params_str];    
    var creq=new XMLHttpRequest();
    creq.open("GET",Comics.pageURL+pageURL,true);
    creq.responseType="document";
    creq.withCredentials = true;
    creq.onload=function(){
      console.log(creq.response);
      var doc=creq.response;
      var nl = Comics.getChapter(doc);
      var array=[];
      var index=0;
      var item={};
      item["payload"]= /cview\(\'.*-(\d*)\.html\',/.exec(nl[nl.length-2].getAttribute("onclick"))[1];
      item["text"]=nl[nl.length-1].textContent;
      // console.log(item["payload"],chapterNum);
      if(item["payload"]===chapterNum){
        index=0;
        item["isMarked"]=true;
        if(this.markedItems.indexOf(chapterNum)===-1){

          var obj={};
          obj[params_str]=this.markedItems;
          chrome.storage.sync.set(obj);
        }
      }
      array.push(item);
      for(var i=nl.length-3;i>=0;--i){
        var item={};
        item["payload"]=/cview\(\'.*-(\d*)\.html\',/.exec(nl[i].getAttribute("onclick"))[1];
        // console.log(item["payload"],chapterNum);
        if(item["payload"]===chapterNum){
          console.log("match",i);
          index=nl.length-i-2;
          item["isMarked"]=true;
          if(this.markedItems.indexOf(chapterNum)===-1){
            this.markedItems.push(chapterNum);
            var obj={};
            obj[params_str]=this.markedItems;
            chrome.storage.sync.set(obj);
          }
        }
        item["text"]=nl[i].textContent.trim();
        if(this.markedItems.indexOf(item.payload)>=0){
          item["isMarked"]=true;  
        }
        array.push(item);
      }
      Comics.setMinChapterIndex(array.length-2);
      if(index>0){
        Comics.setNextURL(array[index-1]["payload"]);  
      }
      console.log("index",index);
      this.setState({menuItems:array,selectedIndex:index,chapter:array[index].text,comicname:Comics.getTitleName(doc)});
      lastIndex=index;
      this._getImage(index,prefixURL+chapterNum);
    }.bind(this);
    creq.send();
  },

  _getImage: function(index,url){
    var req=new XMLHttpRequest();
    req.open("GET",Comics.baseURL+url,true);
    req.responseType="document";
    req.withCredentials = true;
    req.onload=(function(index,req,Comics){
      return function(){
        var doc=req.response;
        Comics.setImages(index, doc);
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
      var menuItems=[];
      for(var i=0;i<this.state.menuItems.length;++i){
        var item={};
        item.text=this.state.menuItems[i].text;
        item.payload=this.state.menuItems[i].payload;
        menuItems.push(item);
      }
      var menuItems=this._cloneMenuItems();
      menuItems[n].number=pageratio;
      this.setState({menuItems:menuItems,pageratio:pageratio});
    }
    if(n===lastIndex){
      if(lastIndex>0){
        // console.log("_updateChapter");
        this._getImage(--lastIndex,prefixURL+this.state.menuItems[lastIndex].payload);
      }        
    }
  }


  
});

module.exports = Main;