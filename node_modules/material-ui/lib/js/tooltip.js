var React = require('react');
var Classable = require('./mixins/classable');

var Tooltip = React.createClass({displayName: "Tooltip",

  mixins: [Classable],

  propTypes: {
    className: React.PropTypes.string,
    label: React.PropTypes.string.isRequired,
    show: React.PropTypes.bool,
    touch: React.PropTypes.bool
  },

  componentDidMount: function() {
    this._setRippleSize();
  },

  componentDidUpdate: function(prevProps, prevState) {
    this._setRippleSize();
  },

  render: function() {
    var $__0=
      
      
         this.props,className=$__0.className,label=$__0.label,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1,label:1});
    var classes = this.getClasses('mui-tooltip', {
      'mui-is-shown': this.props.show,
      'mui-is-touch': this.props.touch
    });

    return (
      React.createElement("div", React.__spread({},  other, {className: classes}), 
        React.createElement("div", {ref: "ripple", className: "mui-tooltip-ripple"}), 
        React.createElement("span", {className: "mui-tooltip-label"}, this.props.label)
      )
    );
  },

  _setRippleSize: function() {
    var ripple = this.refs.ripple.getDOMNode();
    var tooltipSize = this.getDOMNode().offsetWidth;
    var ripplePadding = this.props.touch ? 45 : 20;
    var rippleSize = tooltipSize + ripplePadding + 'px';

    if (this.props.show) {
      ripple.style.height = rippleSize;
      ripple.style.width = rippleSize;
    } else {
      ripple.style.width = '0px';
      ripple.style.height = '0px';
    }
  }

});

module.exports = Tooltip;