var AppDispatcher = require('../dispatcher/AppDispatcher');
var chapterActions = {
  update: function() {
    // console.log("action update");
    AppDispatcher.dispatch({
      actionType: "update"
    });
  },
  scroll: function(text,pageratio){
    // console.log("action scroll");
    AppDispatcher.dispatch({
      actionType: "scroll",
      text: text,
      pageratio:pageratio
    });
  }
};

module.exports = chapterActions;
