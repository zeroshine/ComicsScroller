var React = require('react');
var Classable = require('../mixins/classable');

var RippleCircle = React.createClass({displayName: "RippleCircle",

  mixins: [Classable],

  propTypes: {
    className: React.PropTypes.string,
    started: React.PropTypes.bool,
    ending: React.PropTypes.bool
  },

  render: function() {
    var $__0=
      
      
      
      
      this.props,innerClassName=$__0.innerClassName,started=$__0.started,ending=$__0.ending,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{innerClassName:1,started:1,ending:1});
    var classes = this.getClasses('mui-ripple-circle', {
      'mui-is-started': this.props.started,
      'mui-is-ending': this.props.ending
    });

    return (
      React.createElement("div", React.__spread({},  other, {className: classes}), 
        React.createElement("div", {className: "mui-ripple-circle-inner"})
      )
    );
  }

});

module.exports = RippleCircle;