// require("babel/polyfill");
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
// var assign = require('object-assign');

var chapterStore = Object.assign({}, EventEmitter.prototype, {
  addListener: function(event,callback){
    this.on(event,callback);
  },
  removeListener: function(event,callback){
    this.removeListener(event,callback);
  },
  emitUpdate: function() {
    // console.log("emmitUpdate");
    this.emit("update");
  },
  emitScroll: function(text,pageratio){
    // console.log(text,pageratio );
    this.emit("scroll",text,pageratio);
  }
});


// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case "update":    
      chapterStore.emitUpdate();
      break;
    case "scroll":
      chapterStore.emitScroll(action.text,action.pageratio);
    default:
      // no op
  }
});

module.exports = chapterStore;
