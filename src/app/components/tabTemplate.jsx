var React = require('react');
var Colors= require('material-ui').Styles.Colors;
var TabTemplate = React.createClass({

  render: function(){
    console.log('TabTemplate');
    var styles = {
      display: 'block',
      width: '100%',
      position: 'relative',
      textAlign: 'initial',
      height:352,
      overflowY: 'auto',
      backgroundColor: Colors.grey200
    };

    return (
      <div style={styles}>
        {this.props.children}
      </div>
    );
  },
});

module.exports = TabTemplate;