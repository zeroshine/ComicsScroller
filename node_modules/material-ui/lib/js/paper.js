var React = require('react'),
  Classable = require('./mixins/classable');

var Paper = React.createClass({displayName: "Paper",

  mixins: [Classable],

  propTypes: {
    circle: React.PropTypes.bool,
    innerClassName: React.PropTypes.string,
    innerStyle: React.PropTypes.object,
    rounded: React.PropTypes.bool,
    zDepth: React.PropTypes.oneOf([0,1,2,3,4,5])
  },

  getDefaultProps: function() {
    return {
      innerClassName: '',
      rounded: true,
      zDepth: 1
    };
  },

  render: function() {
    var $__0=
      
      
      
      
      
         this.props,className=$__0.className,circle=$__0.circle,innerClassName=$__0.innerClassName,rounded=$__0.rounded,zDepth=$__0.zDepth,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1,circle:1,innerClassName:1,rounded:1,zDepth:1}),
      classes = this.getClasses(
        'mui-paper ' +
        'mui-z-depth-' + this.props.zDepth, { 
        'mui-rounded': this.props.rounded,
        'mui-circle': this.props.circle
      }),
      insideClasses = 
        this.props.innerClassName + ' ' +
        'mui-paper-container ' +
        'mui-z-depth-bottom';

    return (
      React.createElement("div", React.__spread({},  other, {className: classes}), 
        React.createElement("div", {ref: "innerContainer", className: insideClasses, style: this.props.innerStyle || {}}, 
          this.props.children
        )
      )
    );
  },

  getInnerContainer: function() {
    return this.refs.innerContainer;
  }

});

module.exports = Paper;
