// var React = require('react');
var mui = require('material-ui');
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
    console.log('initial state');
    return {menuItems:[],selectedIndex:null,comicname:"",pageratio:"",chapter:"",starIsMarked:false}
  },    
  
  render: function() {
    var title="Comics Scroller";
    
    var githubButton = (
      <IconButton
        className="github-icon-button"
        iconClassName="icon-github"
        tooltip="Github"
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
      console.log('appendImage');
      for(var i=0;i<this.pageMax;++i){
        var img=new Image();
        img.setAttribute("data-echo",this.images[i]);
        img.setAttribute("data-num",i+1);
        img.setAttribute("data-chapter",index);
        img.style.width="900px";
        img.style.height="1300px";
        img.setAttribute("data-pageMax",this.pageMax);
        img.src="";
        img.className="comics_img";
        document.getElementById("comics_panel").appendChild(img);
      }
      var chapterend=document.createElement("div");
      chapterend.style.width="100%";
      chapterend.style.height="50px";
      chapterend.style.marginBottom="100px";
      chapterend.style.borderBottom="3px solid white";
      document.getElementById("comics_panel").appendChild(chapterend);
  },  

  markedItems: new Set(),

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
    if(n!==this.state.selectedIndex){      
      var menuItems=this._cloneMenuItems({isMarked:true,text:true});
      if(this.markedItems.indexOf(menuItems[n].payload)===-1){
        menuItems[n].isMarked=true;
        this.markedItems.push(menuItems[n].payload);
        //this._saveChromeStoreReaded();
      }
      // console.log('_updateInfor',this.state.menuItems[n].text);      
      this.setState({menuItems:menuItems,selectedIndex: n,chapter:this.state.menuItems[n].text},function(){this._saveChromeStoreReaded()}.bind(this));
    }
    if(typeof(this.state.menuItems[n].num)==="undefined"&&pageratio!==this.state.menuItems[n].number){
      var menuItems=this._cloneMenuItems({isMarked:true,text:true});
      menuItems[n].number=pageratio;
      console.log('_updateInfor2',this.state.menuItems[n].text);
      this.setState({menuItems:menuItems,pageratio:pageratio});
    }
    if(n===this.lastIndex){
      if(this.lastIndex>0){
        this._getImage(--this.lastIndex,this.state.menuItems[this.lastIndex].payload);
      }        
    }
  },

  _starClick:function(){
    console.log('star click');
    var array=this.collectedItems.filter(function(obj){ return obj.url===this.indexURL}.bind(this));
    if(array.length===0){      
      this._saveChromeStoreCollected();
      console.log('star is marked');
      this.setState({starIsMarked:true});  
    }else if(array.length>=0){
      console.log('star no marked');
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
      this.markedItems=[];
      for(var i=0;i<items.readed.length;++i){
        if(items.readed[i].url===this.indexURL){
          this.markedItems=items.readed[i].markedPayload;    
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
      obj.markedPayload=this.markedItems;
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
      console.log('_saveChromeStoreReaded',items);
      chrome.storage.local.set(items);
    }.bind(this));
    chrome.storage.local.get('collected',function(items){
      for(var i=0;i<items.collected.length;++i){
        if(items.collected[i].url===this.indexURL){
          items.collected[i].lastReaded=objectAssign({},this.state.menuItems[this.state.selectedIndex]);    
          items.collected[i].menuItems=this.state.menuItems;
          items.collected[i].markedPayload=this.markedItems;
        }
      }
      console.log('items',items);
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
      obj.markedPayload=this.markedItems;
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
      console.log('items',items);
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