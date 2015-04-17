var React = require('react');
var Classable = require('../mixins/classable');

var SvgIcon = React.createClass({displayName: "SvgIcon",

  mixins: [Classable],

  render: function() {
    var classes = this.getClasses('mui-svg-icon');

    return (
      React.createElement("svg", React.__spread({}, 
        this.props, 
        {className: classes, 
        viewBox: "0 0 24 24"}), 
        this.props.children
      )
    );
  }

});

module.exports = SvgIcon;