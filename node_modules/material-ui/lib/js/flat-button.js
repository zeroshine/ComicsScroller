var React = require('react');
var Classable = require('./mixins/classable');
var EnhancedButton = require('./enhanced-button');

var FlatButton = React.createClass({displayName: "FlatButton",

  mixins: [Classable],

  propTypes: {
    className: React.PropTypes.string,
    label: function(props, propName, componentName){
      if (!props.children && !props.label) {
        return new Error('Warning: Required prop `label` or `children` was not specified in `'+ componentName + '`.')
      }
    },
    primary: React.PropTypes.bool,
    secondary: React.PropTypes.bool
  },

  render: function() {
    var $__0=
        
        
        
        
        this.props,label=$__0.label,primary=$__0.primary,secondary=$__0.secondary,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{label:1,primary:1,secondary:1});
    var classes = this.getClasses('mui-flat-button', {
      'mui-is-primary': !this.props.disabled && primary,
      'mui-is-secondary': !this.props.disabled && !primary && secondary
    });
    var children;

    if (label) children = React.createElement("span", {className: "mui-flat-button-label"}, label);
    else children = this.props.children;

    return (
      React.createElement(EnhancedButton, React.__spread({},  other, 
        {className: classes}), 
        children
      )
    );
  }

});

module.exports = FlatButton;