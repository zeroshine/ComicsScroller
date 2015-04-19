var React = require('react'),
  Classable = require('./mixins/classable');

var AppCanvas = React.createClass({displayName: "AppCanvas",

  mixins: [Classable],

  propTypes: {
    predefinedLayout: React.PropTypes.number
  },

  render: function() {
    var classes = this.getClasses({
      'mui-app-canvas': true,
      'mui-predefined-layout-1': this.props.predefinedLayout === 1
    });

    return (
      React.createElement("div", {className: classes}, 
        this.props.children
      )
    );
  }

});

module.exports = AppCanvas;
