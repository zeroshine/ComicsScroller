var React = require('react');
var Classable = require('../mixins/classable');
var WindowListenable = require('../mixins/window-listenable');
var KeyCode = require('../utils/key-code');
var Calendar = require('./calendar');
var DialogWindow = require('../dialog-window');
var FlatButton = require('../flat-button');

var DatePickerDialog = React.createClass({displayName: "DatePickerDialog",

  mixins: [Classable, WindowListenable],

  propTypes: {
    initialDate: React.PropTypes.object,
    onAccept: React.PropTypes.func,
    onShow: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
  },

  windowListeners: {
    'keyup': '_handleWindowKeyUp'
  },

  getInitialState: function() {
    return {
      isCalendarActive: false
    };
  },

  render: function() {
    var $__0=
      
      
      
      this.props,initialDate=$__0.initialDate,onAccept=$__0.onAccept,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{initialDate:1,onAccept:1});
    var classes = this.getClasses('mui-date-picker-dialog');
    var actions = [
      React.createElement(FlatButton, {
        key: 0, 
        label: "Cancel", 
        secondary: true, 
        onTouchTap: this._handleCancelTouchTap}),
      React.createElement(FlatButton, {
        key: 1, 
        label: "OK", 
        secondary: true, 
        onTouchTap: this._handleOKTouchTap})
    ];

    return (
      React.createElement(DialogWindow, React.__spread({},  other, 
        {ref: "dialogWindow", 
        className: classes, 
        actions: actions, 
        contentClassName: "mui-date-picker-dialog-window", 
        onDismiss: this._handleDialogDismiss, 
        onShow: this._handleDialogShow, 
        repositionOnUpdate: false}), 
        React.createElement(Calendar, {
          ref: "calendar", 
          initialDate: this.props.initialDate, 
          isActive: this.state.isCalendarActive})
      )
    );
  },

  show: function() {
    this.refs.dialogWindow.show();
  },

  dismiss: function() {
    this.refs.dialogWindow.dismiss();
  },

  _handleCancelTouchTap: function() {
    this.dismiss();
  },

  _handleOKTouchTap: function() {
    this.dismiss();
    if (this.props.onAccept) {
      this.props.onAccept(this.refs.calendar.getSelectedDate());
    }
  },

  _handleDialogShow: function() {
    this.setState({
      isCalendarActive: true
    });

    if(this.props.onShow) {
      this.props.onShow();
    }
  },

  _handleDialogDismiss: function() {
    this.setState({
      isCalendarActive: false
    });

    if(this.props.onDismiss) {
      this.props.onDismiss();
    }
  },

  _handleWindowKeyUp: function(e) {
    if (this.refs.dialogWindow.isOpen()) {
      switch (e.keyCode) {
        case KeyCode.ENTER:
          this._handleOKTouchTap();
          break;
      }
    } 
  }

});

module.exports = DatePickerDialog;