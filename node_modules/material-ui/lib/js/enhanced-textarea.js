var React = require('react');
var Classable = require('./mixins/classable');

var EnhancedTextarea = React.createClass({displayName: "EnhancedTextarea",

  mixins: [Classable],

  propTypes: {
    onChange: React.PropTypes.func,
    onHeightChange: React.PropTypes.func,
    textareaClassName: React.PropTypes.string,
    rows: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      rows: 1
    };
  },

  getInitialState: function() {
    return {
      height: this.props.rows * 24
    };
  },

  componentDidMount: function() {
    this._syncHeightWithShadow();
  },

  render: function() {

    var $__0=
      
      
      
      
      
      
      
      this.props,className=$__0.className,onChange=$__0.onChange,onHeightChange=$__0.onHeightChange,textareaClassName=$__0.textareaClassName,rows=$__0.rows,valueLink=$__0.valueLink,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1,onChange:1,onHeightChange:1,textareaClassName:1,rows:1,valueLink:1});

    var classes = this.getClasses('mui-enhanced-textarea');
    var textareaClassName = 'mui-enhanced-textarea-input';
    var style = {
      height: this.state.height + 'px'
    };

    if (this.props.textareaClassName) {
      textareaClassName += ' ' + this.props.textareaClassName;
    }

    if (this.props.hasOwnProperty('valueLink')) {
      other.value = this.props.valueLink.value;
    }

    return (
      React.createElement("div", {className: classes}, 
        React.createElement("textarea", {
          ref: "shadow", 
          className: "mui-enhanced-textarea-shadow", 
          tabIndex: "-1", 
          rows: this.props.rows, 
          defaultValue: this.props.defaultValue, 
          readOnly: true, 
          value: this.props.value}), 
        React.createElement("textarea", React.__spread({}, 
          other, 
          {ref: "input", 
          className: textareaClassName, 
          rows: this.props.rows, 
          style: style, 
          onChange: this._handleChange}))
      )
    );
  },

  getInputNode: function() {
    return this.refs.input.getDOMNode();
  },

  _syncHeightWithShadow: function(newValue, e) {
    var shadow = this.refs.shadow.getDOMNode();
    var currentHeight = this.state.height;
    var newHeight;

    if (newValue !== undefined) shadow.value = newValue;
    newHeight = shadow.scrollHeight;

    if (currentHeight !== newHeight) {
      this.setState({height: newHeight});
      if (this.props.onHeightChange) this.props.onHeightChange(e, newHeight);
    }
  },

  _handleChange: function(e) {
    this._syncHeightWithShadow(e.target.value);

    if (this.props.hasOwnProperty('valueLink')) {
      this.props.valueLink.requestChange(e.target.value);
    }

    if (this.props.onChange) this.props.onChange(e);
  },
  
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.value != this.props.value) {
      this._syncHeightWithShadow(nextProps.value);
    }
  }
});

module.exports = EnhancedTextarea;
