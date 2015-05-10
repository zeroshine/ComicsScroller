var StoreMixin={
  _getStore:function(){
    this.ss=require('sdk/simple-storage');
	this.collectedItems=this.ss.storage.collected;
    var array= this.collectedItems.filter(function(obj){return obj.url===this.indexURL}.bind(this))
    if(array.length>0){
      this.setState({starIsMarked:true});
    }
    
    var updateItems=this.ss.storage.update;
    var array= updateItems.filter(function(obj){return obj.url!==this.indexURL}.bind(this)) 
    this.ss.storage.update=array;
    
    for(var i=0;i<this.ss.storage.readed.length;++i){
      if(this.ss.storage.readed[i].url===this.indexURL){
        this.markedItems=Immutable.Set(items.readed[i].markedPayload);  
      }
    }
    this._getChapter();
  },
  _saveStoreReaded:function(){
  	chrome.storage.local.get('readed',function(items){
      var obj={};
      obj.url=this.indexURL;
      obj.site=this.site;
      obj.iconUrl=this.iconUrl;
      obj.title=this.title;
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
  
  _saveStoreCollected:function(){
  	chrome.storage.local.get('collected',function(items){
      var obj={};
      obj.url=this.indexURL;
      obj.site=this.site;
      obj.iconUrl=this.iconUrl;
      obj.title=this.title;
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
  
  _removeStoreCollected:function(){
    chrome.storage.local.get('collected',function(items){
      this.collectedItems=this.collectedItems.filter(function(obj){return obj.url!==this.indexURL}.bind(this));
      items['collected']=this.collectedItems;
      chrome.storage.local.set(items);
    }.bind(this));
  }
}