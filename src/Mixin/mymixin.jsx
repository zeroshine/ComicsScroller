var React = require('react');
// var mui = require('material-ui');
var Immutable = require('immutable');
var mui = require('material-ui');
var Colors = mui.Styles.Colors;
var Spacing = require('material-ui').Styles.Spacing;
var Typography = mui.Styles.Typography;
var TM = require('../app/components/theme-manager.js');
var ThemeManager=new TM;
var AppCanvas=require('../app/components/app-canvas.jsx');
var AppBar =require('../app/components/app-bar.jsx');
var IconButton=require('../app/components/icon-button.jsx');
var TagIconButton=require('../app/components/TagIconButton.jsx');
var AppLeftNav=require('../app/components/app-left-nav.jsx');

// var ChapterMenu=require('../app/components/chapter-menu.jsx');  
// var objectAssign=require('object-assign');

// var Echo=require('../app/echo');

var MyMixin={

  markedItems: Immutable.Set(),

  collectedItems: [],

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  getStyles: function() {
    // var themeVariables = this.context.muiTheme.component.appBar;
    // var darkWhite = Colors.darkWhite;
    var iconButtonSize=Spacing.iconSize * 2
    return {
      iconButton: {
        style: {
          marginTop: (48 - iconButtonSize) / 2,
          float: 'right',
          marginRight: 8,
          marginLeft: -16
        },
        defaulrIconStyle: {
          fill: Colors.darkWhite,
          color: Colors.darkWhite
        },
        yellowIconStyle: {
          fill: Colors.darkWhite,
          color: Colors.darkWhite
        },
        disableIconStyle: {
          fill: Colors.darkWhite,
          color: Colors.darkWhite
        }
      }
    };
  },

  getInitialState: function(){
    return {
      menuItems:Immutable.List(),
      selectedIndex:null,
      comicname:"",
      pageratio:"",
      leftDisable:true,
      rightDisable:true,
      starDisable:true,
      chapter:"",
      starIsMarked:false}
  },    
  
  render: function() {
    var styles = this.getStyles();
    // var subscribedStyle=
    var githubButton = (
      <IconButton
        className="github-icon-button"
        iconClassName="icon-github"
        style={this.mergeAndPrefix(styles.iconButton.style)}
        // iconStyle={this.mergeAndPrefix(styles.iconButton.iconStyle)}
        tooltip="Github"
        target="_blank"
        href="https://github.com/zeroshine/ComicsScroller"
        linkButton={true} />
    );
    
    var subscribedButton =(
      <IconButton 
        className={"tag-icon-button"} 
        iconClassName={'icon-price-tag'} 
        style={this.mergeAndPrefix(styles.iconButton.style)}
        // iconStyle={this.mergeAndPrefix(styles.iconButton.iconStyle)} 
        tooltip="Subscribed" 
        onClick={this._starClick} 
        disabled={this.state.starDisable} />
    );
    
    var nextButton=(
      <IconButton 
        className="right-icon-button" 
        style={this.mergeAndPrefix(styles.iconButton.style)}
        // iconStyle={this.mergeAndPrefix(styles.iconButton.iconStyle)} 
        iconClassName="icon-circle-right" 
        disabled={this.state.rightDisable} 
        onClick={this._nextClick} 
        tooltip="下一話"/>
    );

    var previousButton=(
      <IconButton 
        className="left-icon-button"  
        style={this.mergeAndPrefix(styles.iconButton.style)}
        // iconStyle={this.mergeAndPrefix(styles.iconButton.iconStyle)} 
        iconClassName="icon-circle-left" 
        disabled={this.state.leftDisable} 
        onClick={this._previousClick} 
        tooltip="上一話"/>
    );

    return (
      <AppCanvas>
        <AppBar 
          title={"Comics Scroller  "+this.state.comicname+"  "+this.state.chapter+"  "+this.state.pageratio} 
          onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap} >
          {subscribedButton}  
          {githubButton}
          {nextButton}
          {previousButton}
        </AppBar>
        <AppLeftNav 
          ref="leftNav" 
          menuItems={this.state.menuItems} 
          selectedIndex={this.state.selectedIndex} 
          isInitiallyOpen={true}  
          onMenuItemClick={this._onMenuItemClick}/>
        <div id="comics_panel" />   
      </AppCanvas>
    );
  },

  _onLeftIconButtonTouchTap: function() {
    // console.log('toggle',this.refs);
    this.refs.leftNav.toggle();
  },

  _onMenuItemClick: function(e, index, item) {
    var menuItems=this.state.menuItems;
    var obj=this.state.menuItems.get(index);
    var payload=obj.get('payload');
    var chstr=obj.get('text');
    if(!this.markedItems.has(payload)){
      obj=obj.set('isMarked',true);
      menuItems=this.state.menuItems.set(index,obj);
      // console.log(menuItems);
      this.markedItems=this.markedItems.add(payload);      
    }
    this.setState({
      menuItems:menuItems,
      rightDisable:index===0,
      leftDisable:index===this.state.menuItems.size-1,
      selectedIndex:index,
      chapter:chstr},
      function(){this._saveStoreReaded()}.bind(this));
    this.lastIndex=index;
    document.title=this.title+" "+chstr;
    this._updateHash(payload,'');
  },  
  
  _starClick:function(){
    var array=this.collectedItems.filter(function(obj){ return obj.url===this.indexURL}.bind(this));
    if(array.length===0){      
      this._saveStoreCollected();
      this.setState({starIsMarked:true});  
    }else if(array.length>=0){
      this._removeStoreCollected();
      this.setState({starIsMarked:false});  
    }
  },

  _previousClick:function(){
    var index=this.state.selectedIndex+1;
    if(index<this.state.menuItems.size){
      var menuItems=this.state.menuItems;
      var obj=this.state.menuItems.get(index);
      var payload=obj.get('payload');
      var chstr=obj.get('text');
      if(!this.markedItems.has(payload)){
        var obj=this.state.menuItems.get(index);
        obj=obj.set('isMarked',true);
        menuItems=this.state.menuItems.set(index,obj);
        this.markedItems=this.markedItems.add(payload);      
      }   
      this.setState({
        menuItems:menuItems,
        selectedIndex:index,
        pageratio:"",
        rightDisable:index===0,
        leftDisable:index===this.state.menuItems.size-1,
        chapter:chstr},
        function(){this._saveStoreReaded()}.bind(this));
      this.lastIndex=index;
      document.title=this.title+" "+chstr;
      this._updateHash(payload,'');
    }
  },

  _nextClick:function(){
    var index=this.state.selectedIndex-1;
    if(index>=0){
      var menuItems=this.state.menuItems;
      var obj=this.state.menuItems.get(index);
      var payload=obj.get('payload');
      var chstr=obj.get('text');
      if(!this.markedItems.has(payload)){
        var obj=this.state.menuItems.get(index);
        obj=obj.set('isMarked',true);
        menuItems=this.state.menuItems.set(index,obj);
        this.markedItems=this.markedItems.add(payload);      
      }   
      this.setState({
        menuItems:menuItems,
        selectedIndex:index,
        pageratio:"",
        rightDisable:index===0,
        leftDisable:index===this.state.menuItems.size-1,
        chapter:chstr},
        function(){this._saveStoreReaded()}.bind(this));
      this.lastIndex=index;
      document.title=this.title+" "+chstr;
      this._updateHash(payload,'');
    }
  }

};

module.exports=MyMixin;