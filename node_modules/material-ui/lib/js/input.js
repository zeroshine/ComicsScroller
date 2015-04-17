var React = require('react');
var Classable = require('./mixins/classable');
var ClassNames = require('classnames');

var Input = React.createClass({displayName: "Input",

  propTypes: {
    multiline: React.PropTypes.bool,
    inlinePlaceholder: React.PropTypes.bool,
    rows: React.PropTypes.number,
    inputStyle: React.PropTypes.string,
    error: React.PropTypes.string,
    description: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    type: React.PropTypes.string,
    onChange: React.PropTypes.func
  },

  mixins: [Classable],

  getInitialState: function() {
    return {
      value: this.props.defaultValue,
      rows: this.props.rows
    };
  },

  getDefaultProps: function() {
    return {
      multiline: false,
      type: "text"
    };
  },

  componentDidMount: function() {
    if (process.NODE_ENV !== 'production') {
      console.warn('Input has been deprecated. Please use TextField instead. See http://material-ui.com/#/components/text-fields');
    }
  },

  render: function() {
    var classes = this.getClasses('mui-input', {
      'mui-floating': this.props.inputStyle === 'floating',
      'mui-text': this.props.type === 'text',
      'mui-error': this.props.error || false,
      'mui-disabled': !!this.props.disabled,
    });
    var placeholder = this.props.inlinePlaceholder ? this.props.placeholder : "";
    var inputIsNotEmpty = !!this.state.value;
    var inputClassName = ClassNames({
      'mui-is-not-empty': inputIsNotEmpty
    });
    var textareaClassName = ClassNames({
      'mui-input-textarea': true,
      'mui-is-not-empty': inputIsNotEmpty
    });
    var inputElement = this.props.multiline ?
      this.props.valueLink ?
        React.createElement("textarea", React.__spread({},  this.props, {ref: "input", 
          className: textareaClassName, 
          placeholder: placeholder, 
          rows: this.state.rows})) :
        React.createElement("textarea", React.__spread({},  this.props, {ref: "input", 
          value: this.state.value, 
          className: textareaClassName, 
          placeholder: placeholder, 
          rows: this.state.rows, 
          onChange: this._onTextAreaChange})) :
        this.props.valueLink ?
          React.createElement("input", React.__spread({},  this.props, {ref: "input", 
            className: inputClassName, 
            placeholder: placeholder})) :
          React.createElement("input", React.__spread({},  this.props, {ref: "input", 
            className: inputClassName, 
            value: this.state.value, 
            placeholder: placeholder, 
            onChange: this._onInputChange}));
    var placeholderSpan = this.props.inlinePlaceholder ? null : 
      React.createElement("span", {className: "mui-input-placeholder", onClick: this._onPlaceholderClick}, 
        this.props.placeholder
      );

    return (
      React.createElement("div", {ref: this.props.ref, className: classes}, 
        inputElement, 
        placeholderSpan, 
        React.createElement("span", {className: "mui-input-highlight"}), 
        React.createElement("span", {className: "mui-input-bar"}), 
        React.createElement("span", {className: "mui-input-description"}, this.props.description), 
        React.createElement("span", {className: "mui-input-error"}, this.props.error)
      )
    );
  },

  getValue: function() {
    return this.state.value;
  },

  setValue: function(txt) {
    this.setState({value: txt});
  },

  clearValue: function() {
    this.setValue('');
  },

  blur: function() {
    if(this.isMounted()) this.refs.input.getDOMNode().blur();
  },
  
  focus: function() {
    if (this.isMounted()) this.refs.input.getDOMNode().focus();
  },

  _onInputChange: function(e) {
    var value = e.target.value;
    this.setState({value: value});
    if (this.props.onChange) this.props.onChange(e, value);
  },

  _onPlaceholderClick: function(e) {
    this.focus();
  },

  _onTextAreaChange: function(e) {
    this._onInputChange(e);
    this._onLineBreak(e);
  },

  _onLineBreak: function(e) {
    var value = e.target.value;
    var lines = value.split('\n').length;

    if (lines > this.state.rows) {
      if (this.state.rows !== 20) {
        this.setState({ rows: ((this.state.rows) + 1)});
      }
    }
  }

});

module.exports = Input;
