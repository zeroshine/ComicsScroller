var React = require('react');
var Classable = require('../mixins/classable');
var FontIcon = require('../font-icon');
var Toggle = require('../toggle');

var Types = {
  LINK: 'LINK',
  SUBHEADER: 'SUBHEADER',
  NESTED: 'NESTED'
};

var MenuItem = React.createClass({displayName: "MenuItem",

  mixins: [Classable],

  propTypes: {
    index: React.PropTypes.number.isRequired,
    iconClassName: React.PropTypes.string,
    iconRightClassName: React.PropTypes.string,
    attribute: React.PropTypes.string,
    number: React.PropTypes.string,
    data: React.PropTypes.string,
    toggle: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    onTouchTap: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onToggle: React.PropTypes.func,
    selected: React.PropTypes.bool
  },
  
  statics: {
    Types: Types
  },

  getDefaultProps: function() {
    return {
      toggle: false,
      disabled: false
    };
  },

  render: function() {
    var classes = this.getClasses('mui-menu-item', {
      'mui-is-selected': this.props.selected,
      'mui-is-disabled': this.props.disabled
    });
    var icon;
    var data;
    var iconRight;
    var attribute;
    var number;
    var toggle;

    if (this.props.iconClassName) icon = React.createElement(FontIcon, {className: 'mui-menu-item-icon ' + this.props.iconClassName});
    if (this.props.iconRightClassName) iconRight = React.createElement(FontIcon, {className: 'mui-menu-item-icon-right ' + this.props.iconRightClassName});
    if (this.props.data) data = React.createElement("span", {className: "mui-menu-item-data"}, this.props.data);
    if (this.props.number !== undefined) number = React.createElement("span", {className: "mui-menu-item-number"}, this.props.number);
    if (this.props.attribute !== undefined) attribute = React.createElement("span", {className: "mui-menu-item-attribute"}, this.props.attribute);
    
    if (this.props.toggle) {
      var $__0=
        
        
        
        
        
        
        this.props,toggle=$__0.toggle,onClick=$__0.onClick,onToggle=$__0.onToggle,children=$__0.children,label=$__0.label,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{toggle:1,onClick:1,onToggle:1,children:1,label:1});
      toggle = React.createElement(Toggle, React.__spread({},  other, {onToggle: this._handleToggle}));
    }

    return (
      React.createElement("div", {
        key: this.props.index, 
        className: classes, 
        onTouchTap: this._handleTouchTap, 
        onClick: this._handleOnClick}, 

        icon, 
        this.props.children, 
        data, 
        attribute, 
        number, 
        toggle, 
        iconRight
        
      )
    );
  },

  _handleTouchTap: function(e) {
    if (!this.props.disabled && this.props.onTouchTap) this.props.onTouchTap(e, this.props.index);
  },

  _handleOnClick: function(e) {
    if (!this.props.disabled && this.props.onClick) this.props.onClick(e, this.props.index);
  },

  _handleToggle: function(e, toggled) {
    if (!this.props.disabled && this.props.onToggle) this.props.onToggle(e, this.props.index, toggled);
  }

});

module.exports = MenuItem;
