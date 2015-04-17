var React = require('react');
var KeyCode = require('./utils/key-code');
var Classable = require('./mixins/classable');
var DomIdable = require('./mixins/dom-idable');
var WindowListenable = require('./mixins/window-listenable');
var FocusRipple = require('./ripples/focus-ripple');
var TouchRipple = require('./ripples/touch-ripple');
var Paper = require('./paper');

var EnhancedSwitch = React.createClass({displayName: "EnhancedSwitch",

  mixins: [Classable, DomIdable, WindowListenable],

	propTypes: {
      id: React.PropTypes.string,
      inputType: React.PropTypes.string.isRequired,
      switchElement: React.PropTypes.element.isRequired,
      iconClassName: React.PropTypes.string.isRequired,
      name: React.PropTypes.string,
	    value: React.PropTypes.string,
	    label: React.PropTypes.string,
	    onSwitch: React.PropTypes.func,
	    required: React.PropTypes.bool,
	    disabled: React.PropTypes.bool,
	    defaultSwitched: React.PropTypes.bool,
      labelPosition: React.PropTypes.oneOf(['left', 'right']),
      disableFocusRipple: React.PropTypes.bool,
      disableTouchRipple: React.PropTypes.bool
	  },

  windowListeners: {
    'keydown': '_handleWindowKeydown',
    'keyup': '_handleWindowKeyup'
  },

  getDefaultProps: function() {
    return {
      iconClassName: ''
    };
  },

  getInitialState: function() {
    return {
      switched: this.props.defaultSwitched ||
        (this.props.valueLink && this.props.valueLink.value),
      isKeyboardFocused: false
    }
  },

  componentDidMount: function() {
    var inputNode = this.refs.checkbox.getDOMNode();
    this.setState({switched: inputNode.checked});
  },

  componentWillReceiveProps: function(nextProps) {
    var hasCheckedLinkProp = nextProps.hasOwnProperty('checkedLink');
    var hasCheckedProp = nextProps.hasOwnProperty('checked');
    var hasToggledProp = nextProps.hasOwnProperty('toggled');
    var hasNewDefaultProp = 
      (nextProps.hasOwnProperty('defaultSwitched') && 
      (nextProps.defaultSwitched != this.props.defaultSwitched));
    var newState = {};

    if (hasCheckedProp) {
      newState.switched = nextProps.checked;
    } else if (hasToggledProp) {
      newState.switched = nextProps.toggled;
    } else if (hasCheckedLinkProp) {
      newState.switched = nextProps.checkedLink.value;
    }

    if (newState) this.setState(newState);
  },

  render: function() {
    var $__0=
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      this.props,type=$__0.type,name=$__0.name,value=$__0.value,label=$__0.label,onSwitch=$__0.onSwitch,defaultSwitched=$__0.defaultSwitched,onBlur=$__0.onBlur,onFocus=$__0.onFocus,onMouseUp=$__0.onMouseUp,onMouseDown=$__0.onMouseDown,onMouseOut=$__0.onMouseOut,onTouchStart=$__0.onTouchStart,onTouchEnd=$__0.onTouchEnd,disableTouchRipple=$__0.disableTouchRipple,disableFocusRipple=$__0.disableFocusRipple,iconClassName=$__0.iconClassName,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{type:1,name:1,value:1,label:1,onSwitch:1,defaultSwitched:1,onBlur:1,onFocus:1,onMouseUp:1,onMouseDown:1,onMouseOut:1,onTouchStart:1,onTouchEnd:1,disableTouchRipple:1,disableFocusRipple:1,iconClassName:1});

    var classes = this.getClasses('mui-enhanced-switch', {
      'mui-is-switched': this.state.switched,
      'mui-is-disabled': this.props.disabled,
      'mui-is-required': this.props.required
    });

    var inputId = this.props.id || this.getDomId();
    
    var labelElement = this.props.label ? (
      React.createElement("label", {className: "mui-switch-label", htmlFor: inputId}, 
        this.props.label
      )
    ) : null;

    var inputProps = {
      ref: "checkbox",
      type: this.props.inputType,
      name: this.props.name,
      value: this.props.value,
      defaultChecked: this.props.defaultSwitched,
      onBlur: this._handleBlur,
      onFocus: this._handleFocus,
      onMouseUp: this._handleMouseUp,
      onMouseDown: this._handleMouseDown,
      onMouseOut: this._handleMouseOut,
      onTouchStart: this._handleTouchStart,
      onTouchEnd: this._handleTouchEnd
    };

    if (!this.props.hasOwnProperty('checkedLink')) {
      inputProps.onChange = this._handleChange;
    }

    var inputElement = (
      React.createElement("input", React.__spread({},  
        other,  
        inputProps, 
        {className: "mui-enhanced-switch-input"}))
    );

    var touchRipple = (
      React.createElement(TouchRipple, {
        ref: "touchRipple", 
        key: "touchRipple", 
        centerRipple: true})
    );

    var focusRipple = (
      React.createElement(FocusRipple, {
        key: "focusRipple", 
        show: this.state.isKeyboardFocused})
    );

    var ripples = [
      this.props.disabled || disableTouchRipple ? null : touchRipple,
      this.props.disabled || disableFocusRipple ? null : focusRipple
    ];

    iconClassName += ' mui-enhanced-switch-wrap';

    var switchElement = (this.props.iconClassName.indexOf("toggle") == -1) ? (
        React.createElement("div", {className: iconClassName}, 
          this.props.switchElement, 
          ripples
        )
      ) : (
        React.createElement("div", {className: iconClassName}, 
          React.createElement("div", {className: "mui-toggle-track"}), 
          React.createElement(Paper, {className: "mui-toggle-thumb", zDepth: 1}, " ", ripples, " ")
        )      
    );

    var labelPositionExist = this.props.labelPosition;

    // Position is left if not defined or invalid.
    var elementsInOrder = (labelPositionExist && 
      (this.props.labelPosition.toUpperCase() === "RIGHT")) ? (
        React.createElement("div", null, 
          switchElement, 
          labelElement
        )
      ) : (
        React.createElement("div", null, 
          labelElement, 
          switchElement
        )
    );

    return (
      React.createElement("div", {className: classes}, 
          inputElement, 
          elementsInOrder
      )
    );
  },


  isSwitched: function() {
    return this.refs.checkbox.getDOMNode().checked;
  },

  // no callback here because there is no event
  setSwitched: function(newSwitchedValue) {
    if (!this.props.hasOwnProperty('checked') || this.props.checked == false) {
      this.setState({switched: newSwitchedValue});  
      this.refs.checkbox.getDOMNode().checked = newSwitchedValue;
    } else if (process.NODE_ENV !== 'production') {
      var message = 'Cannot call set method while checked is defined as a property.';
      console.error(message);
    }
  },

  getValue: function() {
    return this.refs.checkbox.getDOMNode().value;
  },

  isKeyboardFocused: function() {
    return this.state.isKeyboardFocused;
  },

  _handleChange: function(e) {
    
    this._tabPressed = false;
    this.setState({
      isKeyboardFocused: false
    });

    var isInputChecked = this.refs.checkbox.getDOMNode().checked;
    
    if (!this.props.hasOwnProperty('checked')) this.setState({switched: isInputChecked});
    if (this.props.onSwitch) this.props.onSwitch(e, isInputChecked);
  },

  /** 
   * Because both the ripples and the checkbox input cannot share pointer 
   * events, the checkbox input takes control of pointer events and calls 
   * ripple animations manually.
   */

  // Checkbox inputs only use SPACE to change their state. Using ENTER will 
  // update the ui but not the input.
  _handleWindowKeydown: function(e) {
    if (e.keyCode == KeyCode.TAB) this._tabPressed = true;
    if (e.keyCode == KeyCode.SPACE && this.state.isKeyboardFocused) {
      this._handleChange(e);
    }
  },

  _handleWindowKeyup: function(e) {
    if (e.keyCode == KeyCode.SPACE && this.state.isKeyboardFocused) {
      this._handleChange(e);
    }
  },

  _handleMouseDown: function(e) {
    //only listen to left clicks
    if (e.button === 0) this.refs.touchRipple.start(e);
  },

  _handleMouseUp: function(e) {
    this.refs.touchRipple.end();
  },

  _handleMouseOut: function(e) {
    this.refs.touchRipple.end();
  },

  _handleTouchStart: function(e) {
    this.refs.touchRipple.start(e);
  },

  _handleTouchEnd: function(e) {
    this.refs.touchRipple.end();
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
  }

});

module.exports = EnhancedSwitch;
