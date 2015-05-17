// require("babel/polyfill");
var Immutable = require('immutable');
// var objectAssign=require('object-assign');
var StoreMixin={
  _getStore:function(){
    chrome.storage.local.get('collected',function(items){      
      this.collectedItems=items.collected;
      var array= this.collectedItems.filter(function(obj){return obj.url===this.indexURL}.bind(this));
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
  _saveStoreReaded:function(){
  	chrome.storage.local.get('readed',function(items){
      // console.log('readed',items);
      var obj={};
      obj.url=this.indexURL;
      obj.site=this.site;
      obj.iconUrl=this.iconUrl;
      obj.title=this.title;
      obj.markedPayload=this.markedItems.toArray();
      obj.lastReaded=this.state.menuItems.get(this.state.selectedIndex).toObject();
      obj.menuItems=this.state.menuItems.map(item=>item.toObject()).toArray();
      console.log('objmenu',obj.menuItems);
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
          items.collected[i].lastReaded=this.state.menuItems.get(this.state.selectedIndex).toObject();    
          items.collected[i].menuItems=this.state.menuItems.map(item=>item.toObject()).toArray();
          items.collected[i].markedPayload=this.markedItems.toArray();
        }
      }
      chrome.storage.local.set(items);
    }.bind(this));    
  },
  
  _saveStoreCollected:function(){
  	chrome.storage.local.get('collected',function(items){
      var obj={};
      obj.url=this.indexURL;
      obj.site=this.site;
      obj.iconUrl=this.iconUrl;
      obj.title=this.title;
      obj.markedPayload=this.markedItems.toArray();
      obj.menuItems=this.state.menuItems.map(item=>item.toObject()).toArray();
      obj.lastReaded=this.state.menuItems.get(this.state.selectedIndex).toObject();
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
  
  _removeStoreCollected:function(){
    chrome.storage.local.get('collected',function(items){
      this.collectedItems=this.collectedItems.filter(function(obj){return obj.url!==this.indexURL}.bind(this));
      items['collected']=this.collectedItems;
      chrome.storage.local.set(items);
    }.bind(this));
  }
}

module.exports=StoreMixin;