var Classable = require('./mixins/classable');
var React = require('react');

var Toolbar = React.createClass({displayName: "Toolbar",

  mixins: [Classable],

  render: function() {
    var classes = this.getClasses('mui-toolbar', {
    });

    return (
      React.createElement("div", {className: classes}, 
        this.props.children
      )
    );
  }

});

module.exports = Toolbar;
