var React = require('react');
var Classable = require('./mixins/classable');
var EnhancedSwitch = require('./enhanced-switch');
var RadioButtonOff = require('./svg-icons/toggle-radio-button-off');
var RadioButtonOn = require('./svg-icons/toggle-radio-button-on');

var RadioButton = React.createClass({displayName: "RadioButton",

  mixins: [Classable],

  propTypes: {
    onCheck: React.PropTypes.func
  },

  render: function() {

    var $__0=
      
      
      this.props,onCheck=$__0.onCheck,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{onCheck:1});

    var radioButtonElement = (
      React.createElement("div", null, 
          React.createElement(RadioButtonOff, {className: "mui-radio-button-target"}), 
          React.createElement(RadioButtonOn, {className: "mui-radio-button-fill"})
      )
    );

    var enhancedSwitchProps = {
      ref: "enhancedSwitch",
      inputType: "radio",
      switchElement: radioButtonElement,
      className: "mui-radio-button",
      iconClassName: "mui-radio-button-icon",
      onSwitch: this._handleCheck,
      labelPosition: (this.props.labelPosition) ? this.props.labelPosition : "right"
    };

    return (
      React.createElement(EnhancedSwitch, React.__spread({},  
        other, 
        enhancedSwitchProps))
    );
  },

  // Only called when selected, not when unselected.
  _handleCheck: function(e) {
    if (this.props.onCheck) this.props.onCheck(e, this.props.value);
  },

  isChecked: function() {
    return this.refs.enhancedSwitch.isSwitched();
  },

  setChecked: function(newCheckedValue) {
    this.refs.enhancedSwitch.setSwitched(newCheckedValue);
    this.setState({switched: newCheckedValue});
  },
  
  getValue: function() {
    return this.refs.enhancedSwitch.getValue();
  }
});

module.exports = RadioButton;
