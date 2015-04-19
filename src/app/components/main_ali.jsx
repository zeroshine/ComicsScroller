/** In this file, we create a React component which incorporates components provided by material-ui */

var React = require('react');
var mui = require('material-ui');
var AppBar =mui.AppBar;
var AppCanvas=mui.AppCanvas;
var LeftNav=require('./app-left-nav.jsx');
var Menu = mui.Menu;
var ChapterMenu=require('./chapter-menu.jsx');  

var Comics=require('../comics_ali.js');
var Echo=require('../echo');
var ChapterAction=require('../../actions/chapterAction.js');
var ChapterStore=require('../../store/chapterStore.js');

var params_str=window.location.search.substring(1);
var params=params_str.split('&');
var pageURL=/chapter\=(.*)\/(\d*)\.html$/.exec(params[1])[1];   
var chapterURL=/chapter\=(.*)$/.exec(params[1])[1];  
var lastIndex;

var Main = React.createClass({
  
  getInitialState: function(){
    return {menuItems:[],selectedIndex:null,comicname:"",pageratio:"",chapter:""}
  },  

  componentDidMount: function() {
    // ChapterStore.addListener("update",this._updateChapter);
    ChapterStore.addListener("scroll",this._updateInfor);
    this._getChapter();
  },
  
  render: function() {
    var title="Comics Scroller";
    return (
      <AppCanvas predefinedLayout={1}>
        <AppBar title={title+"  "+this.state.chapter+"  "+this.state.comicname+"  "+this.state.pageratio} onMenuIconButtonTouchTap={this._onMenuIconButtonTouchTap} />
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
    var menuItems=[];
    for(var i=0;i<this.state.menuItems.length;++i){
      var it={};
      it.text=this.state.menuItems[i].text;
      it.payload=this.state.menuItems[i].payload;
      menuItems.push(it);
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

  _getChapter: function(){
    console.log(Comics.baseURL+pageURL);    
    var creq=new XMLHttpRequest();
    creq.open("GET",Comics.baseURL+pageURL,true);
    creq.responseType="document";
    creq.withCredentials = true;
    creq.onload=function(){
      var doc=creq.response;
      var nl = Comics.getChapter(doc);
      // console.log(nl);
      this.setState({comicname:Comics.getTitleName(doc)});
      var array=[];
      var index=0;
      for(var i=0;i<nl.length;++i){
        var item={};
        item["payload"]=nl[i].getAttribute("href");
        if(item["payload"]===chapterURL){
          index=i;
        }
        item["text"]=nl[i].textContent;
        // item["number"]="";
        array.push(item);
      }
      Comics.setMinChapterIndex(array.length-1);
      if(index>0){
        Comics.setNextURL(array[index-1]["payload"]);  
      }
      console.log(array);
      this.setState({menuItems:array,selectedIndex:index,chapter:array[index].text});
      lastIndex=index;
      this._getImage(index,chapterURL);
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

  _updateInfor: function(num,pageratio){
    var n=parseInt(num);
    if(n!==this.state.selectedIndex){
      this.setState({selectedIndex: n,chapter:this.state.menuItems[n].text});
    }
    if(typeof(this.state.menuItems[n].num)==="undefined"&&pageratio!==this.state.menuItems[n].number){
      var menuItems=[];
      for(var i=0;i<this.state.menuItems.length;++i){
        var item={};
        item.text=this.state.menuItems[i].text;
        item.payload=this.state.menuItems[i].payload;
        menuItems.push(item);
      }
      // this.state.menuItems.slice();
      menuItems[n].number=pageratio;
      // console.log(menuItems);
      this.setState({menuItems:menuItems,pageratio:pageratio});
      // console.log(this.state.menuItems[n]);
    }
    if(n===lastIndex){
      if(lastIndex>0){
        console.log("_updateChapter");
        this._getImage(--lastIndex,this.state.menuItems[lastIndex].payload);
      }        
    }
  }


  
});

module.exports = Main;