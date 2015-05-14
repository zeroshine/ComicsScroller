// var React = require('react');
var mui = require('material-ui');
var Immutable = require('immutable');
var AppBar =mui.AppBar;
var AppCanvas=mui.AppCanvas;
var IconButton=mui.IconButton;
var TagIconButton=require('../app/components/TagIconButton.jsx');
var AppLeftNav=require('../app/components/app-left-nav.jsx');
var Menu = mui.Menu;
// var ChapterMenu=require('../app/components/chapter-menu.jsx');  
// var objectAssign=require('object-assign');

var Echo=require('../app/echo');

var MyMixin={

  getInitialState: function(){
    return {menuItems:[],
      selectedIndex:null,
      comicname:"",
      pageratio:"",
      leftDisable:false,
      rightDisable:false,
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
          <TagIconButton tooltip="Subscribed" onClick={this._starClick} isMarked={this.state.starIsMarked}/> 
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

  chapterUpdateIndex: -1,
  
  

  setImageIndex:function(index){
    if(this.chapterUpdateIndex===-1){
      this.chapterUpdateIndex=index;
    }else if(this.chapterUpdateIndex===-2){
      var imgs=document.querySelectorAll('img[data-chapter=\"-1\"]');
      for(var i=0;i<imgs.length;++i){
        imgs[i].setAttribute("data-chapter",index);
      }
      this.chapterUpdateIndex=-1;  
    }
  },  

  markedItems: Immutable.Set(),

  collectedItems: [],

  _cloneMenuItems: function(options){
    var menuItems=[];
    for(var i=0;i<this.state.menuItems.length;++i){
      var item={};
      if(options.text===true)item.text=this.state.menuItems[i].text;
      item.payload=this.state.menuItems[i].payload;
      if(options.isMarked===true)item.isMarked=this.state.menuItems[i].isMarked;
      menuItems.push(item);
    }
    return menuItems;
  },

  _updateInfor: function(num,pageratio){
    var index=parseInt(num);
    if(index===-1) return;
    if(index!==this.state.selectedIndex){
      // console.log("not the selectedIndex");      
      var menuItems=this._cloneMenuItems({isMarked:true,text:true});
      if(!this.markedItems.has(this.state.menuItems[index].payload)){
        menuItems[index].isMarked=true;
        this.markedItems=this.markedItems.add(menuItems[index].payload);
      }
      this._updateHash(menuItems[index].payload,"#");
      // console.log('_updateInfor',this.state.menuItems[n].text);      
      document.title=this.title+" "+this.state.menuItems[index].text;
      this.setState({
        menuItems:menuItems,
        rightDisable:index===0,
        leftDisable:index===this.state.menuItems.length-1,
        selectedIndex: index,
        chapter:this.state.menuItems[index].text},
        function(){this._saveStoreReaded()}.bind(this));
    }
    if(typeof(this.state.menuItems[index].number)==="undefined"||pageratio!==this.state.menuItems[index].number){
      var menuItems=this._cloneMenuItems({isMarked:true,text:true});
      menuItems[index].number=pageratio;
      this.setState({menuItems:menuItems,pageratio:pageratio});
    }
    if(index===this.lastIndex){
      if(this.lastIndex>0){
        this._getImage(--this.lastIndex,this.state.menuItems[this.lastIndex].payload);
      }        
    }
  },
  
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
    var panel=document.getElementById("comics_panel");
    var index=this.state.selectedIndex+1;
    if(index<this.state.menuItems.length){
      var menuItems=this._cloneMenuItems({isMarked:true,text:true});
      if(!this.markedItems.has(menuItems[index].payload)){
        menuItems[index].isMarked=true;
        this.markedItems=this.markedItems.add(menuItems[index].payload);      
      }   
      this.setState({
        menuItems:menuItems,
        selectedIndex:index,
        pageratio:"",
        rightDisable:index===0,
        leftDisable:index===this.state.menuItems.length-1,
        chapter:menuItems[index].text},
        function(){this._saveStoreReaded()}.bind(this));
      this.lastIndex=index;
      // panel.innerHTML="";
      // this._getImage(index,item.payload);
      document.title=this.title+" "+this.state.menuItems[index].text;
      this._updateHash(menuItems[index].payload,'');
      if(!Echo.hadInited){
        Echo.init(); 
      }else{
        Echo.run();
      }
    }
  },

  _nextClick:function(){
    var panel=document.getElementById("comics_panel");
    var index=this.state.selectedIndex-1;
    if(index>=0){
      var menuItems=this._cloneMenuItems({isMarked:true,text:true});
      if(!this.markedItems.has(menuItems[index].payload)){
        menuItems[index].isMarked=true;
        this.markedItems=this.markedItems.add(menuItems[index].payload);      
      }   
      this.setState({
        menuItems:menuItems,
        selectedIndex:index,
        pageratio:"",
        rightDisable:index===0,
        leftDisable:index===this.state.menuItems.length-1,
        chapter:menuItems[index].text},
        function(){this._saveStoreReaded()}.bind(this));
      this.lastIndex=index;
      // panel.innerHTML="";
      // this._getImage(index,item.payload);
      document.title=this.title+" "+this.state.menuItems[index].text;
      this._updateHash(menuItems[index].payload,'');
      if(!Echo.hadInited){
        Echo.init(); 
      }else{
        Echo.run();
      }
    }
  }

};

module.exports=MyMixin;