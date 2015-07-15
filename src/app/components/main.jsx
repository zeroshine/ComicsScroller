import React from 'react';
import Comics_dm5 from '../comics_dm5.js';
import Comics_sf from '../comics_sf.js';
import Comics_8 from '../comics_8.js';
import Mixins from '../../Mixin/mymixin.jsx';
import StoreMixin from '../../Mixin/storemixin.jsx';
import ChapterAction from'../../actions/chapterAction.js';
import ChapterStore from '../../store/chapterStore.js';
import { PureRenderMixin } from 'react/addons';
import { Mixins as mMixin } from 'material-ui';

let site= /site\/(\w*)\//.exec(window.location.hash)[1];
// console.log(Comics_sf);
let Comics;

switch (site){
  case 'sf':
    Comics=Comics_sf;
    break;
  case 'comics8':
    Comics=Comics_8;
    break;
  case 'dm5':
    Comics=Comics_dm5;
    break;    
}

let hasAddedListener=false;
let parser=new DOMParser();

// let handler = function(details) {
//   // console.log('handler');
//   let isRefererSet = false,
//     headers = details.requestHeaders,
//     blockingResponse = {},
//     setcookie = false,
//     setreferer = false;
//   for(let i=0 ; i < headers.length ; ++i){
//     if(headers[i].name === "Referer"){
//       headers[i].value = "http://www.manben.com/";
//       setreferer=true;
//     }else if(headers[i].name === "Cookie"){
//       headers[i].value += ";isAdult=1";
//       setcookie=true;
//     }
//   }
//   if(!setreferer){
//     headers.push({      
//       name: "Referer",
//       value: "http://www.manben.com/"
//     }); 
//   }
//   if(!setcookie){
//     headers.push({
//       name: "Cookie",
//       value: "isAdult=1"
//     }); 
//   }
//   blockingResponse.requestHeaders = headers;
//   return blockingResponse;
// };

// chrome.webRequest.onBeforeSendHeaders.addListener(handler, {urls: ["http://www.manben.com/*","http://tel.dm5.com/*","http://www.dm5.com/*"]},['requestHeaders', 'blocking']);

let Main = React.createClass({
  
  mixins:[PureRenderMixin,StoreMixin,Mixins, mMixin.StylePropable],  
  
  componentDidMount: async function() {
    // console.log(Comics);
    Comics.handleUrlHash(this.state.menuItems);
    this.site=Comics.site;
    this.indexURL= await Comics.getIndexURL();
    this._getStore();

    if(!hasAddedListener){
      ChapterStore.addListener("scroll",this._updateInfor);
      window.addEventListener("hashchange",function(e){
        Comics.handleUrlHash(this.state.menuItems);
      }.bind(this));
      hasAddedListener=true;
    }
  },

  _getChapter: function(){    
    var creq=new XMLHttpRequest();
    creq.open("GET",Comics.indexURL,true);
    creq.responseType="document";
    creq.withCredentials = true;
    creq.onload=function(){
      var doc=creq.response;
      this.title=Comics.getTitleName(doc);
      this.iconUrl=Comics.getCoverImg(doc);
      var menuItems=Comics.getMenuItems(doc,this.markedItems);
      var initIndex=Comics.initIndex;
      this.tmp_menuItems=menuItems;
      this.setState({
        menuItems:menuItems,
        selectedIndex:initIndex,
        chapter:menuItems.get(initIndex).get("text"),
        rightDisable:initIndex===0,
        leftDisable:initIndex===menuItems.size-1,
        starDisable:false,
        comicname:this.title
      },
      function(){
        this._saveStoreReaded();
      }.bind(this));
      this.lastIndex=initIndex;
    }.bind(this);
    creq.send();
  },

  _updateInfor:function(num,pageratio){
    let index=parseInt(num);
    if(index===-1) return;
    if(index!==this.state.selectedIndex){
      let obj=this.tmp_menuItems.get(index);
      let payload=obj.get('payload');
      let chstr=obj.get('text');
      // let menuItems=this.state.menuItems;
      console.log(payload);
      if(!this.markedItems.has(payload)){
        obj=obj.set('isMarked',true);
        this.tmp_menuItems=this.tmp_menuItems.set(index,obj);
        this.markedItems=this.markedItems.add(payload);
        // this.tmp_menuItems=menuItems;
      }
      this._updateHash(payload,"#");
      document.title=Comics.title+" "+chstr;
      this.setState({
        // menuItems:menuItems,
        rightDisable:index===0,
        leftDisable:index===this.state.menuItems.size-1,
        selectedIndex: index,
        chapter:chstr},
        function(){this._saveStoreReaded()}.bind(this));
    }
    let obj=this.state.menuItems.get(index);
    if(index===this.lastIndex){
      if(this.lastIndex>0){
        Comics.getImage(--this.lastIndex,this.state.menuItems.get(this.lastIndex).get('payload'));
      }        
    }
  },

  _updateHash:function(url,type){
    // console.log(url);
    let chapterHash="chapter"+Comics.regex.exec(url)[1];
    let str=window.location.hash;
    str=str.replace(/chapter\/.*$/,chapterHash)+type;
    window.location.hash=str;
  }
});

module.exports = Main;