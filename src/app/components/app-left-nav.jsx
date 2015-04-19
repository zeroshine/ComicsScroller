var React = require('react'),
  //Router = require('react-router'),
  mui = require('material-ui');



var AppLeftNav = React.createClass({

  // mixins: [Router.Navigation, Router.State],

  getInitialState: function() {
    return {
      selectedIndex: null
    };
  },

  render: function() {
    var header = <div className="logo" onClick={this._onHeaderClick}>章節</div>;

    return (
      <mui.LeftNav 
        ref="leftNav"
        docked={false}
        isInitiallyOpen={false}
        header={header}
        menuItems={this.props.menuItems} 
        selectedIndex={this.props.selectedIndex}
        onChange={this.props.onMenuItemClick}
        />
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
