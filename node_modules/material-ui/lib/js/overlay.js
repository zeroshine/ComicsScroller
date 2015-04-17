var React = require('react'),
  Classable = require('./mixins/classable');

var Overlay = React.createClass({displayName: "Overlay",

  mixins: [Classable],

  propTypes: {
    show: React.PropTypes.bool,
    autoLockScrolling: React.PropTypes.bool
  },
  
  getDefaultProps: function() {
    return {
      autoLockScrolling: true
    };
  },
  
  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.autoLockScrolling) (this.props.show) ? this._preventScrolling() : this._allowScrolling();
  },

  render: function() {
    var 
      $__0=
        
        
        this.props,className=$__0.className,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1}),
      classes = this.getClasses('mui-overlay', {
        'mui-is-shown': this.props.show
      });

    return (
      React.createElement("div", React.__spread({},  other, {className: classes}))
    );
  },
  
  preventScrolling: function() {
    if (!this.props.autoLockScrolling) this._preventScrolling();
  },
  
  allowScrolling: function() {
    if (!this.props.autoLockScrolling) this._allowScrolling();
  },
  
  _preventScrolling: function() {
    var body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';
  },
  
  _allowScrolling: function() {
    var body = document.getElementsByTagName('body')[0];
    body.style.overflow = '';
  }

});

module.exports = Overlay;