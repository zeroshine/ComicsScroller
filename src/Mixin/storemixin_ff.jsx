var Immutable = require('immutable');
var StoreMixin={
  _getStore:function(){
    this.collecteItems=JSON.parse(localstorage.getItem('collected'));
    var array= this.collectedItems.filter(function(obj){return obj.url===this.indexURL}.bind(this));
    if(array.length>0){
      this.setState({starIsMarked:true});
    }
    var readedItems=JSON.parse(localstorage.getItem('readed'));
    for(var i=0;i<readedItems.length;++i){
      if(readedItems[i].url===this.indexURL){
        this.markedItems=Immutable.Set(items.readed[i].markedPayload);  
          // console.log('init this markedItems',this.markedItems.toArray);  
      }
    }
    this._getChapter();    
  },
  
  _saveStoreReaded:function(){
  	var readedItems=JSON.parse(localstorage.getItem('readed'));
  	var obj={};
    obj.url=this.indexURL;
    obj.site=this.site;
    obj.iconUrl=this.iconUrl;
    obj.title=this.title;
    obj.markedPayload=this.markedItems.toArray();
    obj.menuItems=this.state.menuItems;
    obj.lastReaded=Object.assign({},this.state.menuItems[this.state.selectedIndex]);
    var array=[];
    for(var i=0;i<readedItems.length;++i){
      if(readedItems[i].url!==this.indexURL){
        array.push(readedItems[i]);    
      }
    }
    array.push(obj);
    readedItems=array;
    localstorage.setItem('readed',JSON.stringify(collectedItems));
    
    var collectedItems=JSON.parse(localstorage.getItem('collected'));
    for(var i=0;i<collectedItems.length;++i){
      if(collectedItems[i].url===this.indexURL){
        collectedItems[i].lastReaded=Object.assign({},this.state.menuItems[this.state.selectedIndex]);    
        collectedItems[i].menuItems=this.state.menuItems;
        collectedItems[i].markedPayload=this.markedItems.toArray();
      }
    }
    localstorage.setItem('collected',JSON.stringify(collectedItems));
  },

  _saveStoreCollected:function(){
  	var collectedItems=JSON.parse(localstorage.getItem('collected'));
    var obj={};
    obj.url=this.indexURL;
    obj.site=this.site;
    obj.iconUrl=this.iconUrl;
    obj.title=this.title;
    obj.markedPayload=this.markedItems.toArray();
    obj.menuItems=this.state.menuItems;
    obj.lastReaded=Object.assign({},this.state.menuItems[this.state.selectedIndex]);
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
    collectedItems=this.collectedItems;
    localstorage.setItem('collected',JSON.stringify(collectedItems));
  },

  _removeStoreCollected:function(){

  }
};

module.exports=StoreMixin;