var React = require('react');
var Colors= require('material-ui').Styles.Colors;
var TabTemplate = React.createClass({

  render: function(){
    console.log('TabTemplate');
    var styles = {
      'display': 'block',
      'width': '100%',
      'position': 'relative',
      'text-align': 'initial',
      'height':352,
      'overflow-y': 'auto',
      'backgroundColor': Colors.grey200
    };

    return (
      <div style={styles}>
        {this.props.children}
      </div>
    );
  },
});

module.exports = TabTemplate;