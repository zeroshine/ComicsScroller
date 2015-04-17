var React = require('react');
var Classable = require('./mixins/classable');
var DomIdable = require('./mixins/dom-idable');
var EnhancedTextarea = require('./enhanced-textarea');

var TextField = React.createClass({displayName: "TextField",

  mixins: [Classable, DomIdable],

  propTypes: {
    errorText: React.PropTypes.string,
    floatingLabelText: React.PropTypes.string,
    hintText: React.PropTypes.string,
    id: React.PropTypes.string,
    multiLine: React.PropTypes.bool,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    onEnterKeyDown: React.PropTypes.func,
    type: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      type: 'text'
    };
  },

  getInitialState: function() {
    return {
      errorText: this.props.errorText,
      hasValue: this.props.value || this.props.defaultValue ||
        (this.props.valueLink && this.props.valueLink.value)
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var hasErrorProp = nextProps.hasOwnProperty('errorText');
    var hasValueLinkProp = nextProps.hasOwnProperty('valueLink');
    var hasValueProp = nextProps.hasOwnProperty('value');
    var hasNewDefaultValue = nextProps.defaultValue !== this.props.defaultValue;
    var newState = {};

    if (hasValueProp) {
      newState.hasValue = nextProps.value;
    } else if (hasValueLinkProp) {
      newState.hasValue = nextProps.valueLink.value;
    } else if (hasNewDefaultValue) {
      newState.hasValue = nextProps.defaultValue;
    }

    if (hasErrorProp) newState.errorText = nextProps.errorText;
    if (newState) this.setState(newState);
  },

  render: function() {
    var $__0=
      
      
      
      
      
      
      
      
      
      
      
      this.props,className=$__0.className,errorText=$__0.errorText,floatingLabelText=$__0.floatingLabelText,hintText=$__0.hintText,id=$__0.id,multiLine=$__0.multiLine,onBlur=$__0.onBlur,onChange=$__0.onChange,onFocus=$__0.onFocus,type=$__0.type,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1,errorText:1,floatingLabelText:1,hintText:1,id:1,multiLine:1,onBlur:1,onChange:1,onFocus:1,type:1});

    var classes = this.getClasses('mui-text-field', {
      'mui-has-error': this.props.errorText,
      'mui-has-floating-labels': this.props.floatingLabelText,
      'mui-has-value': this.state.hasValue,
      'mui-is-disabled': this.props.disabled,
      'mui-is-focused': this.state.isFocused,
      'mui-is-multiLine': this.props.multiLine
    });

    var inputId = this.props.id || this.getDomId();

    var errorTextElement = this.state.errorText ? (
      React.createElement("div", {className: "mui-text-field-error"}, this.state.errorText)
    ) : null;

    var hintTextElement = this.props.hintText ? (
      React.createElement("div", {className: "mui-text-field-hint"}, this.props.hintText)
    ) : null;

    var floatingLabelTextElement = this.props.floatingLabelText ? (
      React.createElement("label", {
        className: "mui-text-field-floating-label", 
        htmlFor: inputId}, 
        this.props.floatingLabelText
      )
    ) : null;

    var inputProps;
    var inputElement;

    inputProps = {
      ref: 'input',
      className: 'mui-text-field-input',
      id: inputId,
      onBlur: this._handleInputBlur,
      onFocus: this._handleInputFocus,
      onKeyDown: this._handleInputKeyDown
    };

    if (!this.props.hasOwnProperty('valueLink')) {
      inputProps.onChange = this._handleInputChange;
    }

    inputElement = this.props.multiLine ? (
      React.createElement(EnhancedTextarea, React.__spread({}, 
        other, 
        inputProps, 
        {onHeightChange: this._handleTextAreaHeightChange, 
        textareaClassName: "mui-text-field-textarea"}))
    ) : (
      React.createElement("input", React.__spread({}, 
        other, 
        inputProps, 
        {type: this.props.type}))
    );

    return (
      React.createElement("div", {className: classes}, 

        floatingLabelTextElement, 
        hintTextElement, 
        inputElement, 

        React.createElement("hr", {className: "mui-text-field-underline"}), 
        React.createElement("hr", {className: "mui-text-field-focus-underline"}), 

        errorTextElement

      )
    );
  },

  blur: function() {
    if (this.isMounted()) this._getInputNode().blur();
  },

  clearValue: function() {
    this.setValue('');
  },

  focus: function() {
    if (this.isMounted()) this._getInputNode().focus();
  },

  getValue: function() {
    return this.isMounted() ? this._getInputNode().value : undefined;
  },

  setErrorText: function(newErrorText) {
    if (process.NODE_ENV !== 'production' && this.props.hasOwnProperty('errorText')) {
      console.error('Cannot call TextField.setErrorText when errorText is defined as a property.');
    } else if (this.isMounted()) {
      this.setState({errorText: newErrorText});
    }
  },

  setValue: function(newValue) {
    if (process.NODE_ENV !== 'production' && this._isControlled()) {
      console.error('Cannot call TextField.setValue when value or valueLink is defined as a property.');
    } else if (this.isMounted()) {
      this._getInputNode().value = newValue;
      this.setState({hasValue: newValue});
    }
  },

  _getInputNode: function() {
    return this.props.multiLine ? 
      this.refs.input.getInputNode() : this.refs.input.getDOMNode();
  },

  _handleInputBlur: function(e) {
    this.setState({isFocused: false});
    if (this.props.onBlur) this.props.onBlur(e);
  },

  _handleInputChange: function(e) {
    this.setState({hasValue: e.target.value});
    if (this.props.onChange) this.props.onChange(e);
  },

  _handleInputFocus: function(e) {
    this.setState({isFocused: true});
    if (this.props.onFocus) this.props.onFocus(e);
  },

  _handleInputKeyDown: function(e) {
    if (e.keyCode === 13 && this.props.onEnterKeyDown) this.props.onEnterKeyDown(e);
    if (this.props.onKeyDown) this.props.onKeyDown(e);
  },

  _handleTextAreaHeightChange: function(e, height) {
    var newHeight = height + 24;
    if (this.props.floatingLabelText) newHeight += 24;
    this.getDOMNode().style.height = newHeight + 'px';
  },

  _isControlled: function() {
    return this.props.hasOwnProperty('value') ||
      this.props.hasOwnProperty('valueLink');
  }

});

module.exports = TextField;
