// var React = require('react');
// var mui = require('material-ui');
var Immutable = require('immutable');
var AppBar =require('../app/components/app-bar.jsx');
// var AppBar=require('material-ui').AppBar;
var AppCanvas=require('material-ui').AppCanvas;
var IconButton=require('../app/components/icon-button.jsx');
// var IconButton=require('material-ui').IconButton;
var TagIconButton=require('../app/components/TagIconButton.jsx');
var AppLeftNav=require('../app/components/app-left-nav.jsx');

// var ChapterMenu=require('../app/components/chapter-menu.jsx');  
// var objectAssign=require('object-assign');

// var Echo=require('../app/echo');

var MyMixin={

  markedItems: Immutable.Set(),

  collectedItems: [],

  getInitialState: function(){
    return {
      menuItems:Immutable.List(),
      selectedIndex:null,
      comicname:"",
      pageratio:"",
      leftDisable:true,
      rightDisable:true,
      starDisable:true,
      chapter:"",
      starIsMarked:false}
  },    
  
  render: function() {
    var title="Comics Scroller";
    
    var githubButton = (
      <IconButton
        className="github-icon-button"
        iconClassName="icon-github"
        tooltip="Github"
        target="_blank"
        href="https://github.com/zeroshine/ComicsScroller"
        linkButton={true} />
    );
    
    return (
      <AppCanvas predefinedLayout={1}>
        <AppBar title={title+"  "+this.state.comicname+"  "+this.state.chapter+"  "+this.state.pageratio} onMenuIconButtonTouchTap={this._onMenuIconButtonTouchTap} >
          <TagIconButton tooltip="Subscribed" onClick={this._starClick} isMarked={this.state.starIsMarked} disabled={this.state.starDisable}/> 
          {githubButton}
          <IconButton className="right-icon-button" iconClassName="icon-circle-right" disabled={this.state.rightDisable} onClick={this._nextClick} tooltip="下一話"/>
          <IconButton className="left-icon-button" iconClassName="icon-circle-left" disabled={this.state.leftDisable} onClick={this._previousClick} tooltip="上一話"/>
        </AppBar>
        <AppLeftNav menuItems={this.state.menuItems} selectedIndex={this.state.selectedIndex} isInitiallyOpen={false} ref="leftNav" onMenuItemClick={this._onMenuItemClick}/>
        <div id="comics_panel" />   
      </AppCanvas>
    );
  },

  _onMenuIconButtonTouchTap: function() {
    this.refs.leftNav.toggle();
  },

  _onMenuItemClick: function(e, index, item) {
    var menuItems=this.state.menuItems;
    var obj=this.state.menuItems.get(index);
    var payload=obj.get('payload');
    var chstr=obj.get('text');
    if(!this.markedItems.has(payload)){
      obj=obj.set('isMarked',true);
      menuItems=this.state.menuItems.set(index,obj);
      // console.log(menuItems);
      this.markedItems=this.markedItems.add(payload);      
    }
    this.setState({
      menuItems:menuItems,
      rightDisable:index===0,
      leftDisable:index===this.state.menuItems.size-1,
      selectedIndex:index,
      chapter:chstr},
      function(){this._saveStoreReaded()}.bind(this));
    this.lastIndex=index;
    document.title=this.title+" "+chstr;
    this._updateHash(payload,'');
  },  


  // _cloneMenuItems: function(options){
  //   var menuItems=[];
  //   for(var i=0;i<this.state.menuItems.length;++i){
  //     var item={};
  //     if(options.text===true)item.text=this.state.menuItems[i].text;
  //     item.payload=this.state.menuItems[i].payload;
  //     if(options.isMarked===true)item.isMarked=this.state.menuItems[i].isMarked;
  //     menuItems.push(item);
  //   }
  //   return menuItems;
  // },


  
  _starClick:function(){
    var array=this.collectedItems.filter(function(obj){ return obj.url===this.indexURL}.bind(this));
    if(array.length===0){      
      this._saveStoreCollected();
      this.setState({starIsMarked:true});  
    }else if(array.length>=0){
      this._removeStoreCollected();
      this.setState({starIsMarked:false});  
    }
  },

  _previousClick:function(){
    // var panel=document.getElementById("comics_panel");
    var index=this.state.selectedIndex+1;
    if(index<this.state.menuItems.size){
      var menuItems=this.state.menuItems;
      var obj=this.state.menuItems.get(index);
      var payload=obj.get('payload');
      var chstr=obj.get('text');
      if(!this.markedItems.has(payload)){
        var obj=this.state.menuItems.get(index);
        obj=obj.set('isMarked',true);
        menuItems=this.state.menuItems.set(index,obj);
        this.markedItems=this.markedItems.add(payload);      
      }   
      this.setState({
        menuItems:menuItems,
        selectedIndex:index,
        pageratio:"",
        rightDisable:index===0,
        leftDisable:index===this.state.menuItems.size-1,
        chapter:chstr},
        function(){this._saveStoreReaded()}.bind(this));
      this.lastIndex=index;
      // panel.innerHTML="";
      // this._getImage(index,item.payload);
      document.title=this.title+" "+chstr;
      this._updateHash(payload,'');
    }
  },

  _nextClick:function(){
    // var panel=document.getElementById("comics_panel");
    var index=this.state.selectedIndex-1;
    if(index>=0){
      var menuItems=this.state.menuItems;
      var obj=this.state.menuItems.get(index);
      var payload=obj.get('payload');
      var chstr=obj.get('text');
      if(!this.markedItems.has(payload)){
        var obj=this.state.menuItems.get(index);
        obj=obj.set('isMarked',true);
        menuItems=this.state.menuItems.set(index,obj);
        this.markedItems=this.markedItems.add(payload);      
      }   
      this.setState({
        menuItems:menuItems,
        selectedIndex:index,
        pageratio:"",
        rightDisable:index===0,
        leftDisable:index===this.state.menuItems.size-1,
        chapter:chstr},
        function(){this._saveStoreReaded()}.bind(this));
      this.lastIndex=index;
      // panel.innerHTML="";
      // this._getImage(index,item.payload);
      document.title=this.title+" "+chstr;
      this._updateHash(payload,'');
    }
  }

};

module.exports=MyMixin;