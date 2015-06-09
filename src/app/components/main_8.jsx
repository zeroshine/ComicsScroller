var React = require('react');
var Immutable = require('immutable');
var Comics=require('../comics_8.js');
// var Echo=require('../echo');
var Mixins=require('../../Mixin/mymixin.jsx');
var StoreMixin=require('../../Mixin/storemixin.jsx');

var ChapterAction=require('../../actions/chapterAction.js');
var ChapterStore=require('../../store/chapterStore.js');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var StylePropable = require('material-ui').Mixins.StylePropable;
var hasAddedListener=false;

var Main = React.createClass({
  
  mixins:[PureRenderMixin,StoreMixin,Mixins,StylePropable],

  componentDidMount: function() {
    // ChapterStore.addListener("update",this._updateChapter);
    Comics.handleUrlHash(this.state.menuItems);
    this.site=Comics.site;
    this.indexURL=Comics.indexURL;
    // this._getImage(-1,this.chapterNum);
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
  _updateInfor: function(num,pageratio){
    // console.log(num);
    var index=parseInt(num);
    if(index===-1) return;
    
    if(index!==this.state.selectedIndex){
      var obj=this.state.menuItems.get(index);
      var payload=obj.get('payload');
      var chstr=obj.get('text');
      // var oldpn=obj.get('number');
      var menuItems=this.state.menuItems;
      if(!this.markedItems.has(payload)){
        obj=obj.set('isMarked',true);
        menuItems=this.state.menuItems.set(index,obj);
        this.markedItems=this.markedItems.add(payload);
      }
      this._updateHash(payload,"#");
      document.title=Comics.title+" "+chstr;
      this.tmp_menuItems=menuItems;
      this.setState({
        // menuItems:menuItems,
        rightDisable:index===0,
        leftDisable:index===this.state.menuItems.size-1,
        selectedIndex: index,
        chapter:chstr},
        function(){this._saveStoreReaded()}.bind(this));
    }
    var obj=this.state.menuItems.get(index);
    // var oldpn=obj.get('number');
    // if(pageratio!==this.state.pageratio){
      // this.setState({pageratio:pageratio});
    // }
    if(index===this.lastIndex){
      if(this.lastIndex>0){
        Comics.getImage(--this.lastIndex,this.state.menuItems.get(this.lastIndex).get('payload'));
      }        
    }
  },

  _updateHash:function(url,type){
    var chapterHash="chapter\/"+Comics.regex.exec(url)[1];
    var str=window.location.hash;
    str=str.replace(/chapter\/.*$/,chapterHash)+type;
    window.location.hash=str;
  }

});

module.exports = Main;