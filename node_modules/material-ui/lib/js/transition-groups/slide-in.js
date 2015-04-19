var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Classable = require('../mixins/classable');

var SlideIn = React.createClass({displayName: "SlideIn",

  mixins: [Classable],

  propTypes: {
    direction: React.PropTypes.oneOf(['left', 'right', 'up', 'down'])
  },

  getDefaultProps: function() {
    return {
      direction: 'left'
    };
  },

  render: function() {
    var $__0=
      
      
      
      this.props,className=$__0.className,direction=$__0.direction,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1,direction:1});
    var classes = this.getClasses('mui-transition-slide-in');

    classes += ' mui-is-' + this.props.direction;

    //Add a custom className to every child
    React.Children.forEach(this.props.children, function(child) {
      child.props.className = child.props.className ?
        child.props.className + ' mui-transition-slide-in-child':
        'mui-transition-slide-in-child';
    });

    return (
      React.createElement(ReactCSSTransitionGroup, React.__spread({},  other, 
        {className: classes, 
        transitionName: "mui-transition-slide-in", 
        component: "div"}), 
        this.props.children
      )
    );
  }

});

module.exports = SlideIn;