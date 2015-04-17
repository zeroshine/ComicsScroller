var React = require('react');
var Classable = require('../mixins/classable');
var WindowListenable = require('../mixins/window-listenable');
var DateTime = require('../utils/date-time');
var KeyCode = require('../utils/key-code');
var DatePickerDialog = require('./date-picker-dialog');
var TextField = require('../text-field');

var DatePicker = React.createClass({displayName: "DatePicker",

  mixins: [Classable, WindowListenable],

  propTypes: {
    defaultDate: React.PropTypes.object,
    formatDate: React.PropTypes.func,
    mode: React.PropTypes.oneOf(['portrait', 'landscape', 'inline']),
    onFocus: React.PropTypes.func,
    onTouchTap: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onShow: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
  },

  windowListeners: {
    'keyup': '_handleWindowKeyUp'
  },

  getDefaultProps: function() {
    return {
      formatDate: DateTime.format
    };
  },

  getInitialState: function() {
    return {
      date: this.props.defaultDate,
      dialogDate: new Date()
    };
  },

  render: function() {
    var $__0=
      
      
      
      
      
      
      
      this.props,formatDate=$__0.formatDate,mode=$__0.mode,onFocus=$__0.onFocus,onTouchTap=$__0.onTouchTap,onShow=$__0.onShow,onDismiss=$__0.onDismiss,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{formatDate:1,mode:1,onFocus:1,onTouchTap:1,onShow:1,onDismiss:1});
    var classes = this.getClasses('mui-date-picker', {
      'mui-is-landscape': this.props.mode === 'landscape',
      'mui-is-inline': this.props.mode === 'inline'
    });
    var defaultInputValue;

    if (this.props.defaultDate) {
      defaultInputValue = this.props.formatDate(this.props.defaultDate);
    }

    return (
      React.createElement("div", {className: classes}, 
        React.createElement(TextField, React.__spread({}, 
          other, 
          {ref: "input", 
          defaultValue: defaultInputValue, 
          onFocus: this._handleInputFocus, 
          onTouchTap: this._handleInputTouchTap})), 
        React.createElement(DatePickerDialog, {
          ref: "dialogWindow", 
          initialDate: this.state.dialogDate, 
          onAccept: this._handleDialogAccept, 
          onShow: onShow, 
          onDismiss: onDismiss})
      )

    );
  },

  getDate: function() {
    return this.state.date;
  },

  setDate: function(d) {
    this.setState({
      date: d
    });
    this.refs.input.setValue(this.props.formatDate(d));
  },

  _handleDialogAccept: function(d) {
    this.setDate(d);
    if (this.props.onChange) this.props.onChange(null, d);
  },

  _handleInputFocus: function(e) {
    e.target.blur();
    if (this.props.onFocus) this.props.onFocus(e);
  },

  _handleInputTouchTap: function(e) {
    this.setState({
      dialogDate: this.getDate()
    });

    this.refs.dialogWindow.show();
    if (this.props.onTouchTap) this.props.onTouchTap(e);
  },

  _handleWindowKeyUp: function(e) {
    //TO DO: open the dialog if input has focus
  }

});

module.exports = DatePicker;
