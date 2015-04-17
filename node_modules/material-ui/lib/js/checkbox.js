var React = require('react');
var EnhancedSwitch = require('./enhanced-switch');
var Classable = require('./mixins/classable');
var CheckboxOutline = require('./svg-icons/toggle-check-box-outline-blank');
var CheckboxChecked = require('./svg-icons/toggle-check-box-checked');

var Checkbox = React.createClass({displayName: "Checkbox",

  mixins: [Classable],

  propTypes: {
    onCheck: React.PropTypes.func,
  },

  render: function() {
    var $__0=
      
      
      this.props,onCheck=$__0.onCheck,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{onCheck:1});

    var classes = this.getClasses("mui-checkbox");

    var checkboxElement = (
      React.createElement("div", null, 
        React.createElement(CheckboxOutline, {className: "mui-checkbox-box"}), 
        React.createElement(CheckboxChecked, {className: "mui-checkbox-check"})
      )
    );

    var enhancedSwitchProps = {
      ref: "enhancedSwitch",
      inputType: "checkbox",
      switchElement: checkboxElement,
      className: classes,
      iconClassName: "mui-checkbox-icon",
      onSwitch: this._handleCheck,
      labelPosition: (this.props.labelPosition) ? this.props.labelPosition : "right"
    };

    return (
      React.createElement(EnhancedSwitch, React.__spread({},  
        other, 
        enhancedSwitchProps))
    );
  },

  isChecked: function() {
    return this.refs.enhancedSwitch.isSwitched();
  },

  setChecked: function(newCheckedValue) {
    this.refs.enhancedSwitch.setSwitched(newCheckedValue);
  },

  _handleCheck: function(e, isInputChecked) {
    if (this.props.onCheck) this.props.onCheck(e, isInputChecked);
  }
});

module.exports = Checkbox;
