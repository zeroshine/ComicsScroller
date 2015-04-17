var React = require('react');
var Classable = require('./mixins/classable');
var ClickAwayable = require('./mixins/click-awayable');
var DropDownArrow = require('./svg-icons/drop-down-arrow');
var KeyLine = require('./utils/key-line');
var Paper = require('./paper');
var Menu = require('./menu/menu');

var DropDownMenu = React.createClass({displayName: "DropDownMenu",

  mixins: [Classable, ClickAwayable],

  propTypes: {
    autoWidth: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    menuItems: React.PropTypes.array.isRequired
  },

  getDefaultProps: function() {
    return {
      autoWidth: true
    };
  },

  getInitialState: function() {
    return {
      open: false,
      selectedIndex: this.props.selectedIndex || 0
    }
  },

  componentClickAway: function() {
    this.setState({ open: false });
  },

  componentDidMount: function() {
    if (this.props.autoWidth) this._setWidth();
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.hasOwnProperty('selectedIndex')) {
      this.setState({selectedIndex: nextProps.selectedIndex});
    }
  },

  render: function() {
    var classes = this.getClasses('mui-drop-down-menu', {
      'mui-open': this.state.open
    });

    return (
      React.createElement("div", {className: classes}, 
        React.createElement("div", {className: "mui-menu-control", onClick: this._onControlClick}, 
          React.createElement(Paper, {className: "mui-menu-control-bg", zDepth: 0}), 
          React.createElement("div", {className: "mui-menu-label"}, 
            this.props.menuItems[this.state.selectedIndex].text
          ), 
          React.createElement(DropDownArrow, {className: "mui-menu-drop-down-icon"}), 
          React.createElement("div", {className: "mui-menu-control-underline"})
        ), 
        React.createElement(Menu, {
          ref: "menuItems", 
          autoWidth: this.props.autoWidth, 
          selectedIndex: this.state.selectedIndex, 
          menuItems: this.props.menuItems, 
          hideable: true, 
          visible: this.state.open, 
          onItemClick: this._onMenuItemClick})
      )
    );
  },

  _setWidth: function() {
    var el = this.getDOMNode(),
      menuItemsDom = this.refs.menuItems.getDOMNode();

    el.style.width = menuItemsDom.offsetWidth + 'px';
  },

  _onControlClick: function(e) {
    this.setState({ open: !this.state.open });
  },

  _onMenuItemClick: function(e, key, payload) {
    if (this.props.onChange && this.state.selectedIndex !== key) this.props.onChange(e, key, payload);
    this.setState({
      selectedIndex: key,
      open: false
    });
  }

});

module.exports = DropDownMenu;