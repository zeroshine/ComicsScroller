var React = require('react');
var Classable = require('./mixins/classable');
var DialogWindow = require('./dialog-window');

var Dialog = React.createClass({displayName: "Dialog",

  mixins: [Classable],

  propTypes: {
    title: React.PropTypes.node
  },

  render: function() {
    var $__0=
      
      
      this.props,className=$__0.className,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1});
    var classes = this.getClasses('mui-dialog');
    var title;

    if (this.props.title) {
      // If the title is a string, wrap in an h3 tag.
      // If not, just use it as a node.
      title = Object.prototype.toString.call(this.props.title) === '[object String]' ?
        React.createElement("h3", {className: "mui-dialog-title"}, this.props.title) :
        this.props.title;
    }

    return (
      React.createElement(DialogWindow, React.__spread({}, 
        other, 
        {ref: "dialogWindow", 
        className: classes}), 

        title, 
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
