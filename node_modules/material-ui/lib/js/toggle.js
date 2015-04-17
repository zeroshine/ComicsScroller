var React = require('react');
var Classable = require('./mixins/classable');
var Paper = require('./paper');
var EnhancedSwitch = require('./enhanced-switch');

var Toggle = React.createClass({displayName: "Toggle",

  mixins: [Classable],

  propTypes: {
    onToggle: React.PropTypes.func,
    toggled: React.PropTypes.bool,
    defaultToggled: React.PropTypes.bool
  },

  render: function() {
    var $__0=
      
      
      this.props,onToggle=$__0.onToggle,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{onToggle:1});

    var toggleElement = (
      React.createElement("div", null, 
        React.createElement("div", {className: "mui-toggle-track"}), 
        React.createElement(Paper, {className: "mui-toggle-thumb", zDepth: 1})
      )
    );

    var enhancedSwitchProps = {
      ref: "enhancedSwitch",
      inputType: "checkbox",
      switchElement: toggleElement,
      className: "mui-toggle",
      iconClassName: "mui-toggle-icon",
      onSwitch: this._handleToggle,
      defaultSwitched: this.props.defaultToggled,
      labelPosition: (this.props.labelPosition) ? this.props.labelPosition : "left"
    };

    if (this.props.hasOwnProperty('toggled')) enhancedSwitchProps.checked = this.props.toggled;

    return (
      React.createElement(EnhancedSwitch, React.__spread({},  
        other, 
        enhancedSwitchProps))
    );
  },

  isToggled: function() {
    return this.refs.enhancedSwitch.isSwitched();
  },

  setToggled: function(newToggledValue) {
    this.refs.enhancedSwitch.setSwitched(newToggledValue);
  },

  _handleToggle: function(e, isInputChecked) {
    if (this.props.onToggle) this.props.onToggle(e, isInputChecked);
  }
});

module.exports = Toggle;
