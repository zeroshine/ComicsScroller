var React = require('react');
var KeyCode = require('./utils/key-code');
var Classable = require('./mixins/classable');
var WindowListenable = require('./mixins/window-listenable');
var FocusRipple = require('./ripples/focus-ripple');
var TouchRipple = require('./ripples/touch-ripple');

var EnhancedButton = React.createClass({displayName: "EnhancedButton",

  mixins: [Classable, WindowListenable],

  propTypes: {
    centerRipple: React.PropTypes.bool,
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    disableFocusRipple: React.PropTypes.bool,
    disableTouchRipple: React.PropTypes.bool,
    linkButton: React.PropTypes.bool,
    onBlur: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    onTouchTap: React.PropTypes.func
  },

  windowListeners: {
    'keydown': '_handleWindowKeydown',
    'keyup': '_handleWindowKeyup'
  },

  getInitialState: function() {
    return {
      isKeyboardFocused: false 
    };
  },

  render: function() {
    var $__0=
      
      
      
      
      
      
      
      
         this.props,centerRipple=$__0.centerRipple,disabled=$__0.disabled,disableFocusRipple=$__0.disableFocusRipple,disableTouchRipple=$__0.disableTouchRipple,linkButton=$__0.linkButton,onBlur=$__0.onBlur,onFocus=$__0.onFocus,onTouchTap=$__0.onTouchTap,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{centerRipple:1,disabled:1,disableFocusRipple:1,disableTouchRipple:1,linkButton:1,onBlur:1,onFocus:1,onTouchTap:1});
    var classes = this.getClasses('mui-enhanced-button', {
      'mui-is-disabled': disabled,
      'mui-is-keyboard-focused': this.state.isKeyboardFocused,
      'mui-is-link-button': linkButton
    });
    var touchRipple = (
      React.createElement(TouchRipple, {
        ref: "touchRipple", 
        key: "touchRipple", 
        centerRipple: centerRipple}, 
        this.props.children
        )
    );
    var focusRipple = (
      React.createElement(FocusRipple, {
        key: "focusRipple", 
        show: this.state.isKeyboardFocused})
    );
    var buttonProps = {
      className: classes,
      disabled: disabled,
      onBlur: this._handleBlur,
      onFocus: this._handleFocus,
      onTouchTap: this._handleTouchTap
    };
    var buttonChildren = [
      disabled || disableTouchRipple ? this.props.children : touchRipple,
      disabled || disableFocusRipple ? null : focusRipple
    ];

    if (disabled && linkButton) {
      return (
        React.createElement("span", React.__spread({},  other, 
          {className: classes, 
          disabled: disabled}), 
          this.props.children
        )
      );
    }

    return linkButton ? (
      React.createElement("a", React.__spread({},  other,  buttonProps), 
        buttonChildren
      )
    ) : (
      React.createElement("button", React.__spread({},  other,  buttonProps), 
        buttonChildren
      )
    );
  },

  isKeyboardFocused: function() {
    return this.state.isKeyboardFocused;
  },

  _handleWindowKeydown: function(e) {
    if (e.keyCode == KeyCode.TAB) this._tabPressed = true;
    if (e.keyCode == KeyCode.ENTER && this.state.isKeyboardFocused) {
      this._handleTouchTap(e);
    }
  },

  _handleWindowKeyup: function(e) {
    if (e.keyCode == KeyCode.SPACE && this.state.isKeyboardFocused) {
      this._handleTouchTap(e);
    }
  },

  _handleBlur: function(e) {
    this.setState({
      isKeyboardFocused: false
    });

    if (this.props.onBlur) this.props.onBlur(e);
  },

  _handleFocus: function(e) {
    //setTimeout is needed becuase the focus event fires first
    //Wait so that we can capture if this was a keyboard focus
    //or touch focus
    setTimeout(function() {
      if (this._tabPressed) {
        this.setState({
          isKeyboardFocused: true
        });
      }
    }.bind(this), 150);
    
    if (this.props.onFocus) this.props.onFocus(e);
  },

  _handleTouchTap: function(e) {
    this._tabPressed = false;
    this.setState({
      isKeyboardFocused: false
    });
    if (this.props.onTouchTap) this.props.onTouchTap(e);
  }

});

module.exports = EnhancedButton;