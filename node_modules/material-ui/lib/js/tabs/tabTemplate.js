var React = require('react');

var TabTemplate = React.createClass({displayName: "TabTemplate",

  render: function(){

    return (
      React.createElement("div", {className: "mui-tab-template"}, 
        this.props.children
      )
    );
  },
});

module.exports = TabTemplate;