var React = require('react');

var InkBar = React.createClass({displayName: "InkBar",
  
  propTypes: {
    position: React.PropTypes.string
  },
  
  render: function() {

    var styles = {
      left: this.props.left,
      width: this.props.width
    }

    return (
      React.createElement("div", {className: "mui-ink-bar", style: styles}, 
        " "
      )
    );
  }

});

module.exports = InkBar;