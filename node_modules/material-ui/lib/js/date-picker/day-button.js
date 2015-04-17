var React = require('react');
var Classable = require('../mixins/classable');
var DateTime = require('../utils/date-time');
var EnhancedButton = require('../enhanced-button');

var DayButton = React.createClass({displayName: "DayButton",

  mixins: [Classable],

  propTypes: {
    date: React.PropTypes.object,
    onTouchTap: React.PropTypes.func,
    selected: React.PropTypes.bool
  },

  render: function() {
    var $__0=
      
      
      
      
      
      this.props,className=$__0.className,date=$__0.date,onTouchTap=$__0.onTouchTap,selected=$__0.selected,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1,date:1,onTouchTap:1,selected:1});
    var classes = this.getClasses('mui-date-picker-day-button', { 
      'mui-is-current-date': DateTime.isEqualDate(this.props.date, new Date()),
      'mui-is-selected': this.props.selected
    });

    return this.props.date ? (
      React.createElement(EnhancedButton, React.__spread({},  other, 
        {className: classes, 
        disableFocusRipple: true, 
        disableTouchRipple: true, 
        onTouchTap: this._handleTouchTap}), 
        React.createElement("div", {className: "mui-date-picker-day-button-select"}), 
        React.createElement("span", {className: "mui-date-picker-day-button-label"}, this.props.date.getDate())
      )
    ) : (
      React.createElement("span", {className: classes})
    );
  },

  _handleTouchTap: function(e) {
    if (this.props.onTouchTap) this.props.onTouchTap(e, this.props.date);
  }

});

module.exports = DayButton;