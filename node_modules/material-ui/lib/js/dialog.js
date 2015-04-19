var React = require('react');
var Classable = require('./mixins/classable');
var DialogWindow = require('./dialog-window');

var Dialog = React.createClass({displayName: "Dialog",

  mixins: [Classable],

  propTypes: {
    title: React.PropTypes.string
  },

  render: function() {
    var $__0=
      
      
      
      this.props,className=$__0.className,title=$__0.title,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1,title:1});
    var classes = this.getClasses('mui-dialog');

    return (
      React.createElement(DialogWindow, React.__spread({}, 
        other, 
        {ref: "dialogWindow", 
        className: classes}), 

        React.createElement("h3", {className: "mui-dialog-title"}, this.props.title), 
        React.createElement("div", {ref: "dialogContent", className: "mui-dialog-content"}, 
          this.props.children
        )
        
      )
    );
  },

  dismiss: function() {
    this.refs.dialogWindow.dismiss();
  },

  show: function() {
    this.refs.dialogWindow.show();
  }

});

module.exports = Dialog;