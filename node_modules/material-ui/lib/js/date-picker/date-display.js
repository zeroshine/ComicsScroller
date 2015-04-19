var React = require('react');
var Classable = require('../mixins/classable');
var DateTime = require('../utils/date-time');
var SlideInTransitionGroup = require('../transition-groups/slide-in');

var DateDisplay = React.createClass({displayName: "DateDisplay",

  mixins: [Classable],

  propTypes: {
    selectedDate: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      transitionDirection: 'up'
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var direction;

    if (nextProps.selectedDate !== this.props.selectedDate) {
      direction = nextProps.selectedDate > this.props.selectedDate ? 'up' : 'down';
      this.setState({
        transitionDirection: direction
      });
    }
  },

  render: function() {
    var $__0=
      
      
      this.props,selectedDate=$__0.selectedDate,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{selectedDate:1});
    var classes = this.getClasses('mui-date-picker-date-display');
    var dayOfWeek = DateTime.getDayOfWeek(this.props.selectedDate);
    var month = DateTime.getShortMonth(this.props.selectedDate);
    var day = this.props.selectedDate.getDate();
    var year = this.props.selectedDate.getFullYear();

    return (
      React.createElement("div", React.__spread({},  other, {className: classes}), 

        React.createElement(SlideInTransitionGroup, {
          className: "mui-date-picker-date-display-dow", 
          direction: this.state.transitionDirection}, 
          React.createElement("div", {key: dayOfWeek}, dayOfWeek)
        ), 

        React.createElement("div", {className: "mui-date-picker-date-display-date"}, 

          React.createElement(SlideInTransitionGroup, {
            className: "mui-date-picker-date-display-month", 
            direction: this.state.transitionDirection}, 
            React.createElement("div", {key: month}, month)
          ), 

          React.createElement(SlideInTransitionGroup, {
            className: "mui-date-picker-date-display-day", 
            direction: this.state.transitionDirection}, 
            React.createElement("div", {key: day}, day)
          ), 

          React.createElement(SlideInTransitionGroup, {
            className: "mui-date-picker-date-display-year", 
            direction: this.state.transitionDirection}, 
            React.createElement("div", {key: year}, year)
          )

        )

      )
    );
  }

});

module.exports = DateDisplay;