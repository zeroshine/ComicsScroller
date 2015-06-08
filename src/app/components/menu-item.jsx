var React = require('react');
var StylePropable = require('material-ui').Mixins.StylePropable;
var FontIcon = require('material-ui').FontIcon;
var Toggle = require('material-ui').Toggle;
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var Types = {
  LINK: 'LINK',
  SUBHEADER: 'SUBHEADER',
  NESTED: 'NESTED'
};

var MenuItem = React.createClass({

  mixins: [PureRenderMixin,StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    index: React.PropTypes.number.isRequired,
    className: React.PropTypes.string,
    iconClassName: React.PropTypes.string,
    iconRightClassName: React.PropTypes.string,
    iconStyle: React.PropTypes.object,
    iconRightStyle: React.PropTypes.object,
    attribute: React.PropTypes.string,
    number: React.PropTypes.string,
    data: React.PropTypes.string,
    toggle: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    onTouchTap: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onToggle: React.PropTypes.func,
    selected: React.PropTypes.bool
  },
  
  statics: {
    Types: Types
  },

  getDefaultProps: function() {
    return {
      toggle: false,
      disabled: false
    };
  },

  getInitialState: function() {
    return {
      hovered: false
    }
  },

  getTheme: function() {
    return this.context.muiTheme.component.menuItem;
  },

  getSpacing: function() {
    return this.context.muiTheme.spacing;
  },

  getStyles: function() {
    var styles = {
      root: {
        userSelect: 'none',
        cursor: 'pointer',
        lineHeight: this.getTheme().height + 'px',
        paddingLeft: this.getTheme().padding,
        paddingRight: this.getTheme().padding,
        color: this.getTheme().textColor
      },
      number: {
        float: 'right',
        width: 24,
        textAlign: 'center'
      },
      attribute: {
        float: 'right'
      },
      iconRight: {
        lineHeight: this.getTheme().height + 'px',
        float: 'right'
      },
      icon: {
        float: 'left',
        lineHeight: this.getTheme().height + 'px',
        marginRight: this.getSpacing().desktopGutter
      },
      data: {
        display: 'block',
        paddingLeft: this.getSpacing().desktopGutter * 2,
        lineHeight: this.getTheme().dataHeight + 'px',
        height: this.getTheme().dataHeight + 'px',
        verticalAlign: 'top',
        top: -12,
        position: 'relative',
        fontWeight: 300,
        color: this.getTheme().textColor
      },
      toggle: {
        marginTop: ((this.getTheme().height - this.context.muiTheme.component.radioButton.size) / 2),
        float: 'right',
        width: 42
      },
      rootWhenHovered: {
        backgroundColor: this.getTheme().hoverColor
      },
      rootWhenSelected: {
        color: this.getTheme().selectedTextColor
      },
      rootWhenDisabled: {
        cursor: 'default',
        color: this.context.muiTheme.palette.disabledColor
      },
      rootWhenMarked:{
        color: this.getTheme().markedColor,
        backgroundColor: this.getTheme().markedBackgroundColor
      }
    };
    return styles;
  },


  render: function() {
    var icon;
    var data;
    var iconRight;
    var attribute;
    var number;
    var toggleElement;

    var styles = this.getStyles();
    console.log('data',styles.data);
    if (this.props.iconClassName) icon = <FontIcon style={this.mergeAndPrefix(styles.icon, this.props.iconStyle)} className={this.props.iconClassName} />;
    if (this.props.iconRightClassName) iconRight = <FontIcon style={this.mergeAndPrefix(styles.iconRight, this.props.iconRightStyle)} className={this.props.iconRightClassName} />;
    if (this.props.data) data = <span style={this.mergeAndPrefix(styles.data)}>{this.props.data}</span>;
    if (this.props.number !== undefined) number = <span style={this.mergeAndPrefix(styles.number)}>{this.props.number}</span>;
    if (this.props.attribute !== undefined) attribute = <span style={this.mergeAndPrefix(styles.style)}>{this.props.attribute}</span>;
    
    if (this.props.toggle) {
      var {
        toggle,
        onClick,
        onToggle,
        onMouseOver,
        onMouseOut,
        children,
        label,
        style,
        ...other
      } = this.props;
      toggleElement = <Toggle {...other} onToggle={this._handleToggle} style={styles.toggle}/>;
    }
    console.log('menuItem',this.mergeAndPrefix(
          styles.root,
          this.props.isMarked && styles.rootWhenMarked, 
          this.props.selected && styles.rootWhenSelected,
          (this.state.hovered && !this.props.disabled) && styles.rootWhenHovered,
          this.props.style,
          this.props.disabled && styles.rootWhenDisabled));
    return (
      <div
        key={this.props.index}
        className={this.props.className} 
        onTouchTap={this._handleTouchTap}
        onClick={this._handleOnClick}
        onMouseOver={this._handleMouseOver}
        onMouseOut={this._handleMouseOut}
        style={this.mergeAndPrefix(
          styles.root,
          this.props.isMarked && styles.rootWhenMarked, 
          this.props.selected && styles.rootWhenSelected,
          (this.state.hovered && !this.props.disabled) && styles.rootWhenHovered,
          this.props.style,
          this.props.disabled && styles.rootWhenDisabled)}>
        
        {icon}
        {this.props.children}
        {data}
        {attribute}
        {number}
        {toggleElement}
        {iconRight}
        
      </div>
    );
  },

  _handleTouchTap: function(e) {
    if (!this.props.disabled && this.props.onTouchTap) this.props.onTouchTap(e, this.props.index);
  },

  _handleOnClick: function(e) {
    if (!this.props.disabled && this.props.onClick) this.props.onClick(e, this.props.index);
  },

  _handleToggle: function(e, toggled) {
    if (!this.props.disabled && this.props.onToggle) this.props.onToggle(e, this.props.index, toggled);
  },

  _handleMouseOver: function(e) {
    this.setState({hovered: true});
    if (!this.props.disabled && this.props.onMouseOver) this.props.onMouseOver(e);
  },

  _handleMouseOut: function(e) {
    this.setState({hovered: false});
    if (!this.props.disabled && this.props.onMouseOut) this.props.onMouseOut(e);
  }

});

module.exports = MenuItem;
