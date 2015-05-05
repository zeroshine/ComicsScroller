// var React = require('react');
var mui = require('material-ui');
var Immutable = require('immutable');
var AppBar =mui.AppBar;
var AppCanvas=mui.AppCanvas;
var IconButton=mui.IconButton;
var TagIconButton=require('../app/components/TagIconButton.jsx');
var LeftNav=require('../app/components/app-left-nav.jsx');
var Menu = mui.Menu;
var ChapterMenu=require('../app/components/chapter-menu.jsx');  
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

  appendImage:function(index){
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
    console.log('set image index',index);
    var imgs=document.querySelectorAll('img[data-chapter="-1"]');
    for(var i=0;i<imgs.length;++i){
      imgs[i].setAttribute("data-chapter",index);
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
      this.setState({menuItems:menuItems,selectedIndex: n,chapter:this.state.menuItems[n].text},function(){this._saveChromeStoreReaded()}.bind(this));
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
      this._saveChromeStoreCollected();
      this.setState({starIsMarked:true});  
    }else if(array.length>=0){
      this._removeChromeStoreCollected();
      this.setState({starIsMarked:false});  
    }
  },
  
  _getChromeStore:function(){
  	   
    chrome.storage.local.get('collected',function(items){      
      this.collectedItems=items.collected;
      var array= this.collectedItems.filter(function(obj){return obj.url===this.indexURL}.bind(this))
      if(array.length>0){
        this.setState({starIsMarked:true});
      } 
    }.bind(this));

    chrome.storage.local.get('update',function(items){      
      var updateItems=items.update;
      var array= updateItems.filter(function(obj){return obj.url!==this.indexURL}.bind(this)) 
      items.update=array;
      var badgeText=(array.length===0)?"":array.length.toString()
      chrome.browserAction.setBadgeText({text:badgeText});
      chrome.storage.local.set(items);  
    }.bind(this));

    chrome.storage.local.get('readed',function(items){
      for(var i=0;i<items.readed.length;++i){
        if(items.readed[i].url===this.indexURL){
          this.markedItems=Immutable.Set(items.readed[i].markedPayload);  
          // console.log('init this markedItems',this.markedItems.toArray);  
        }
      }
      this._getChapter();
    }.bind(this));
  },
  _saveChromeStoreReaded:function(){
  	chrome.storage.local.get('readed',function(items){
      // menuItems=this._cloneMenuItems({isMarked:false,text:true});
      var obj={};
      obj.url=this.indexURL;
      obj.site=this.site;
      obj.iconUrl=this.iconUrl;
      obj.title=this.title;
      // console.log(this.markedItems,this.markedItems.toArray());
      obj.markedPayload=this.markedItems.toArray();
      obj.menuItems=this.state.menuItems;
      obj.lastReaded=objectAssign({},this.state.menuItems[this.state.selectedIndex]);
      var array=[];
      for(var i=0;i<items.readed.length;++i){
        if(items.readed[i].url!==this.indexURL){
          array.push(items.readed[i]);    
        }
      }
      array.push(obj);
      items.readed=array;
      chrome.storage.local.set(items);
    }.bind(this));
    chrome.storage.local.get('collected',function(items){
      for(var i=0;i<items.collected.length;++i){
        if(items.collected[i].url===this.indexURL){
          items.collected[i].lastReaded=objectAssign({},this.state.menuItems[this.state.selectedIndex]);    
          items.collected[i].menuItems=this.state.menuItems;
          items.collected[i].markedPayload=this.markedItems.toArray();
        }
      }
      chrome.storage.local.set(items);
    }.bind(this));    
  },
  
  _saveChromeStoreCollected:function(){
  	chrome.storage.local.get('collected',function(items){
      var obj={};
      obj.url=this.indexURL;
      obj.site=this.site;
      obj.iconUrl=this.iconUrl;
      obj.title=this.title;
      // console.log(this.markedItems,this.markedItems.toSeq().toArray());
      obj.markedPayload=this.markedItems.toArray();
      obj.menuItems=this.state.menuItems;
      obj.lastReaded=objectAssign({},this.state.menuItems[this.state.selectedIndex]);
      var urlInItems=false;
      for(var i=0;i<this.collectedItems.length;++i){
        if(this.collectedItems[i].url===this.indexURL){
          this.collectedItems[i]=obj;
          urlInItems=true;    
        }
      }
      if(!urlInItems){
        this.collectedItems.push(obj);
      }
      items.collected=this.collectedItems;
      chrome.storage.local.set(items);
    }.bind(this));
  },
  
  _removeChromeStoreCollected:function(){
    chrome.storage.local.get('collected',function(items){
      this.collectedItems=this.collectedItems.filter(function(obj){return obj.url!==this.indexURL}.bind(this));
      items['collected']=this.collectedItems;
      chrome.storage.local.set(items);
    }.bind(this));
  }

}

module.exports=MyMixin;