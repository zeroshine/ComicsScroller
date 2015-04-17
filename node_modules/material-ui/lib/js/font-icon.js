var React = require('react');
var Classable = require('./mixins/classable');

var FontIcon = React.createClass({displayName: "FontIcon",

  mixins: [Classable],

  render: function() {

    var $__0=
      
      
      this.props,className=$__0.className,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1});
    var classes = this.getClasses('mui-font-icon');

    return (
      React.createElement("span", React.__spread({},  other, {className: classes}))
    );
  }

});

module.exports = FontIcon;