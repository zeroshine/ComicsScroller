var Immutable = require('immutable');
var StoreMixin={
  _getStore:function(){
    var citems=self.options.collected;
    // console.log('citems',citems);
    this.collectedItems = (citems===null) ? []: citems;
    var array= this.collectedItems.filter(function(obj){return obj.url===this.indexURL}.bind(this));
    if(array.length>0){
      this.setState({starIsMarked:true});
    }
    var ritems=self.options.readed;
    // console.log('ritems',ritems);
    var readedItems=(ritems===null)? []:ritems;
    for(var i=0;i<readedItems.length;++i){
      if(readedItems[i].url===this.indexURL){
        this.markedItems=Immutable.Set(readedItems[i].markedPayload);  
          // console.log('init this markedItems',this.markedItems.toArray);  
      }
    }
    this._getChapter();    
  },
  
  _saveStoreReaded:function(){
    // console.log('this.indexURL',this.indexURL);
  	// var ritems=localStorage.getItem('readed');
    // var readedItems=(ritems===null)? []:JSON.parse(ritems);
  	var obj={};
    obj.url=this.indexURL;
    obj.site=this.site;
    obj.iconUrl=this.iconUrl;
    obj.title=this.title;
    obj.markedPayload=this.markedItems.toArray();
    obj.menuItems=this.state.menuItems.map(item=>item.toObject()).toArray();
    obj.lastReaded=this.state.menuItems.get(this.state.selectedIndex).toObject();
    // console.log('obj',obj.lastReaded);
    self.port.emit("saveReaded", JSON.stringify(obj));
    // var array=[];
    // for(var i=0;i<readedItems.length;++i){
    //   if(readedItems[i].url!==this.indexURL){
    //     array.push(readedItems[i]);    
    //   }
    // }
    // array.push(obj);
    // readedItems=array;
    // console.log('readed save',readedItems);
    // localStorage.setItem('readed',JSON.stringify(readedItems));
    
    // var citems=localStorage.getItem('collected');
    // var collectedItems=(citems===null)? []:JSON.parse(citems);
    // for(var i=0;i<collectedItems.length;++i){
    //   if(collectedItems[i].url===this.indexURL){
    //     collectedItems[i].lastReaded=Object.assign({},this.state.menuItems[this.state.selectedIndex]);    
    //     collectedItems[i].menuItems=this.state.menuItems;
    //     collectedItems[i].markedPayload=this.markedItems.toArray();
    //   }
    // }
    // localStorage.setItem('collected',JSON.stringify(collectedItems));
  },

  _saveStoreCollected:function(){
  	// var citems=localStorage.getItem('collected');
   //  var collectedItems=(citems===null)? []:JSON.parse(citems);
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
    collectedItems=this.collectedItems;
    self.port.emit('saveCollected',JSON.stringify(collectedItems));
  },

  _removeStoreCollected:function(){
    this.collectedItems=this.collectedItems.filter(function(obj){return obj.url!==this.indexURL}.bind(this));
    self.port.emit('saveCollected',JSON.stringify(this.collectedItems));
  }
};

module.exports=StoreMixin;