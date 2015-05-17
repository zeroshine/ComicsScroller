var React = require('react'),
  //Router = require('react-router'),
  LeftNav = require('./left-nav.jsx');
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
    // menuItems:React.PropTypes.array,
    onMenuItemClick:React.PropTypes.func
  },

  getInitialState: function() {
    return {
      selectedIndex: null
    };
  },

  render: function() {
    var header = (<div className="logo" onClick={this._onHeaderClick}>章節</div>);

    return (
      <LeftNav 
        ref="leftNav"
        docked={false}
        isInitiallyOpen={false}
        header={header}
        menuItems={this.props.menuItems} 
        selectedIndex={this.props.selectedIndex}
        onChange={this.props.onMenuItemClick}/>
    );
  },

  toggle: function() {
    this.refs.leftNav.toggle();
  },

  _onHeaderClick: function() {
    this.refs.leftNav.close();
  }

});

module.exports = AppLeftNav;
