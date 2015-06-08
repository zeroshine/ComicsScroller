var React = require('react'),
  //Router = require('react-router'),
  LeftNav = require('./left-nav.jsx');
var Colors= require('material-ui').Styles.Colors;
var Typography=require('material-ui').Styles.Typography;
var Spacing=require('material-ui').Styles.Spacing;
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;



var AppLeftNav = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState) {
    if(this.props.selectedIndex!==nextProps.selectedIndex){
      console.log('appleftNav update');
      return true;
    } 
    return false;
  },
  propTypes: {
    selectedIndex:React.PropTypes.number,
    menuItems:React.PropTypes.object,
    onMenuItemClick:React.PropTypes.func
  },

  getInitialState: function() {
    return {
      selectedIndex: null
    };
  },

  getStyles: function() {
    return {
      cursor: 'pointer',
      fontSize: '24px',
      color: Typography.textFullWhite,
      lineHeight: 48 + 'px',
      fontWeight: Typography.fontWeightLight,
      backgroundColor: Colors.grey800,
      paddingLeft: Spacing.desktopGutter,
      paddingTop: '0px',
      marginBottom: '8px'
    };
  },

  render: function() {
    var header = (<div style={this.getStyles()} onClick={this._onHeaderClick}>章節</div>);

    return (
      <LeftNav 
        ref="leftNav"
        docked={false}
        isInitiallyOpen={true}
        header={header}
        menuItems={this.props.menuItems} 
        selectedIndex={this.props.selectedIndex}
        onChange={this.props.onMenuItemClick}/>
    );
  },

  toggle: function() {
    console.log('app left nav toggle');
    this.refs.leftNav.toggle();
  },

  _onHeaderClick: function() {
    this.refs.leftNav.close();
  }

});

module.exports = AppLeftNav;
