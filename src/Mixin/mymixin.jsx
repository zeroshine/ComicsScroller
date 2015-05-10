// var React = require('react');
var mui = require('material-ui');
var Immutable = require('immutable');
var AppBar =mui.AppBar;
var AppCanvas=mui.AppCanvas;
var IconButton=mui.IconButton;
var TagIconButton=require('../app/components/TagIconButton.jsx');
var LeftNav=require('../app/components/app-left-nav.jsx');
var Menu = mui.Menu;
// var ChapterMenu=require('../app/components/chapter-menu.jsx');  
var objectAssign=require('object-assign');

var Echo=require('../app/echo');

var MyMixin={

  getInitialState: function(){
    return {menuItems:[],selectedIndex:null,comicname:"",pageratio:"",chapter:"",starIsMarked:false}
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
          <TagIconButton tooltip="Subscribed" onClick={this._starClick} isMarked={this.state.starIsMarked}/> {githubButton}
        </AppBar>
        <LeftNav menuItems={this.state.menuItems} selectedIndex={this.state.selectedIndex} isInitiallyOpen={false} ref="leftNav" onMenuItemClick={this._onMenuItemClick}/>
        <div id="comics_panel" />   
      </AppCanvas>
    );
  },

  _onMenuIconButtonTouchTap: function() {
    this.refs.leftNav.toggle();
  },

  chapterUpdateIndex: -1,
  
  appendImage:function(index){
      if(index===-1){
        index=this.chapterUpdateIndex;
        this.chapterUpdateIndex=-2;
      }
      for(var i=0;i<this.pageMax;++i){
        var img=new Image();
        img.src="../img/Transparent.gif";
        img.setAttribute("data-echo",this.images[i]);
        img.setAttribute("data-num",i+1);
        img.setAttribute("data-chapter",index);
        img.style.width="900px";
        img.style.height="1300px";
        img.style.borderWidth="1px";
        img.style.borderColor="white";
        img.style.borderStyle="solid";
        img.setAttribute("data-pageMax",this.pageMax);
        img.className="comics_img";
        document.getElementById("comics_panel").appendChild(img);
      }
      var chapterEnd=document.createElement("div");
      chapterEnd.className="comics_img_end";
      chapterEnd.textContent="本話結束";
      document.getElementById("comics_panel").appendChild(chapterEnd);
  },

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
    var n=parseInt(num);
    if(n===-1) return;
    if(n!==this.state.selectedIndex){      
      var menuItems=this._cloneMenuItems({isMarked:true,text:true});
      if(!this.markedItems.has(this.state.menuItems[n].payload)){
        menuItems[n].isMarked=true;
        this.markedItems=this.markedItems.add(menuItems[n].payload);
      }
      this._updateHash(menuItems[n].payload,"#");
      // console.log('_updateInfor',this.state.menuItems[n].text);      
      document.title=this.title+" "+this.state.menuItems[n].text;
      this.setState({menuItems:menuItems,selectedIndex: n,chapter:this.state.menuItems[n].text},function(){this._saveStoreReaded()}.bind(this));
    }
    if(typeof(this.state.menuItems[n].number)==="undefined"||pageratio!==this.state.menuItems[n].number){
      var menuItems=this._cloneMenuItems({isMarked:true,text:true});
      menuItems[n].number=pageratio;
      this.setState({menuItems:menuItems,pageratio:pageratio});
    }
    if(n===this.lastIndex){
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
  }

}

module.exports=MyMixin;