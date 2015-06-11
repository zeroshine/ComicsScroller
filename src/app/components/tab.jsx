var React = require('react');
var TabTemplate = require('./tabTemplate.jsx');
var StylePropable = require('material-ui').Mixins.StylePropable;
var Colors = require('material-ui').Styles.Colors;
var Tab = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    handleTouchTap: React.PropTypes.func,
    selected: React.PropTypes.bool,
    width: React.PropTypes.string
  },

  handleTouchTap: function(){
    this.props.handleTouchTap(this.props.tabIndex, this);
  },

  render: function(){
    var styles = this.mergeAndPrefix({
      display: 'table-cell',
      cursor: 'pointer',
      textAlign: 'center',
      verticalAlign: 'middle',
      height: '48px',
      color: Colors.white,
      opacity: '.6',
      fontSize: '18px',
      fontWeight: '500',
      whiteSpace: 'initial',
      fontFamily: this.context.muiTheme.contentFontFamily,
      boxSizing: 'border-box',
      width: this.props.width
    }, this.props.style);

    if (this.props.selected) styles.opacity = '1';

    return (
    <div style={styles} onTouchTap={this.handleTouchTap} routeName={this.props.route}>
      {this.props.label}
    </div>
    )
  }

});

module.exports = Tab;
