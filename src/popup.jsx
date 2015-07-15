require('./less/popup.less');
var React = require('react');
var mui=require('material-ui');
var Paper=mui.Paper;
var AppCanvas=mui.AppCanvas;
var Tab=require('./app/components/tab.jsx');
var Tabs=require('./app/components/tabs.jsx');
var IconButton=mui.IconButton;
var SvgIcon=mui.SvgIcon;
var injectTapEventPlugin = require("react-tap-event-plugin");

var Colors = mui.Styles.Colors;
var Spacing = mui.Styles.Spacing;
var Typography = mui.Styles.Typography;
var TM = require('./app/components/theme-manager.js');
var ThemeManager=new TM;
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var StylePropable = require('material-ui').Mixins.StylePropable;
// React.initializeTouchEvents(true);
// var Card=require('./app/components/card.jsx');
injectTapEventPlugin();

var Card=React.createClass({

	mixins:[StylePropable,PureRenderMixin],

	getInitialState: function() {
	    return {
	      titleHovered: false,
	      siteHovered: false,
	      readedHovered: false,
	    }
	},

	childContextTypes: {
	    muiTheme: React.PropTypes.object
	},

	getChildContext: function() {
	    return {
	      muiTheme: ThemeManager.getCurrentTheme()
	    }
	},

	getStyles:function(){
		var styles={
			materialCard:{
				verticalAlign:'top',
				height:150,
				margin:10
			},
			img:{
				height:150,
				width: 150,
				float: 'left'
			},
			materialCardInfor:{
				verticalAlign:'top',
				textAlign: 'top',
				display: 'inline-block',
				width: 250,
				float: 'left',
				margin:0,
				marginLeft:10,
				height:150
			},
			cardLink:{
				fontSize: 15,
			    lineHeight: 24+'px',
			    fontWeight: 400,
			    letterSpacing: 0,
			    padding: 0,
			    marginTop: 0,
			    marginBottom: 5,			   
			    color:'black'
			},
			cardTitle:{
				fontSize: 24,
			    lineHeight: 32+'px',
			    fontWeight: 400,
			    letterSpacing: 0,
			    padding: 0,
			    marginTop: 0,
			    marginBottom: 5,
			    color:'black'
			},
			hovered:{
				color:'blue',
				cursor: 'pointer'
			}
		};
		return styles;
	},
	render:function(){
		// console.log('this.props.indexURL',this.props.indexURL);
		var styles=this.getStyles();
		switch(this.props.site){
			case 'sf':
				this.siteurl="http://comic.sfacg.com";
				break;
			case 'dm5':
				this.siteurl="http://www.manben.com";
				break;
			case 'comics8':
				this.siteurl="http://www.8comic.com/";
		}
		return(
			<Paper style={styles.materialCard} key={this.props.index} zDepth={2}>
				<img src={this.props.iconUrl} 
					style={this.mergeAndPrefix(
						// styles.materialCard,
						styles.img
					)}/> 
				<div style={this.mergeAndPrefix(
						// styles.materialCard,
						styles.materialCardInfor
					)}>
					<div onMouseOver={this._handleTitleMouseOver} 
						onMouseOut={this._handleTitleMouseOut} 
						onClick={this._openIndex}
						style={this.mergeAndPrefix(
							// styles.materialCard,
							// styles.materialCardInfor,
							styles.cardTitle,
							this.state.titleHovered && styles.hovered	
						)}>
						
					{this.props.title} 
					</div>	
					<div onMouseOver={this._handleSiteMouseOver} 
						onMouseOut={this._handleSiteMouseOut} 					
						onClick={this._openSite}
						style={this.mergeAndPrefix(
							// styles.materialCard,
							// styles.materialCardInfor,
							styles.cardLink,
							this.state.siteHovered && styles.hovered	
						)}>
					{this.props.site}
					</div>
					<div onMouseOver={this._handleReadedMouseOver} 
						onMouseOut={this._handleReadedMouseOut} 
						onClick={this._openPage}
						style={this.mergeAndPrefix(
							// styles.materialCard,
							// styles.materialCardInfor,
							styles.cardLink,
							this.state.readedHovered && styles.hovered	
						)}>
					{this.props.str+' '+this.props.lastReaded.text}
					</div>				
				</div>
				<div className={'trash'}  onClick={this._removeElemet} >
					<span className={'lid'} />
					<span className={'can'} />
				</div>
			</Paper>
		);

	},

	_handleTitleMouseOut:function(){
		this.setState({titleHovered:false});
	},

	_handleTitleMouseOver:function(){
		this.setState({titleHovered:true});
	},

	_handleSiteMouseOut:function(){
		this.setState({siteHovered:false});
	},

	_handleSiteMouseOver:function(){
		this.setState({siteHovered:true});
	},

	_handleReadedMouseOut:function(){
		this.setState({readedHovered:false});
	},

	_handleReadedMouseOver:function(){
		this.setState({readedHovered:true});
	},

	_removeElemet:function(e){
		this.props.removeElemet(e,this.props.index);
	},
	
	_openSite:function(){
		chrome.tabs.create({url:this.siteurl});
	},
	
	_openPage:function(){
		chrome.tabs.create({url:this.props.lastReaded.payload});
	},
	
	_openIndex:function(){
		// console.log('this.props.indexURL',this.props.indexURL);
		chrome.tabs.create({url:this.props.indexURL});
	}

});

var Cards=React.createClass({
	childContextTypes: {
	    muiTheme: React.PropTypes.object
	},

	getChildContext: function() {
	    return {
	      muiTheme: ThemeManager.getCurrentTheme()
	    };
	},	
	getInitialState:function(){
		return {collectedItems:[],historyItems:[],updateItems:[]};
	},
	componentDidMount:function(){
		chrome.storage.local.get('collected',function(items){
      		// console.log('get collected',items);
      		var urllist=items.collected;
      		this.setState({collectedItems:urllist});
		}.bind(this));
		chrome.storage.local.get('readed',function(items){
      		// console.log('get readed',items);
      		var urllist=items.readed;
      		this.setState({historyItems:urllist});
		}.bind(this));
		chrome.storage.local.get('update',function(items){
      		// console.log('get update',items);
      		var urllist=items.update;
      		this.setState({updateItems:urllist});
		}.bind(this));
	},
	render:function(){
		var classes='material-popup-container';
		return (
			<AppCanvas>
				<Tabs>
					 <Tab label="Update" > 
					   <div > 
					    {this._getUpdateChildren()}   
					   </div> 
					 </Tab>
					 <Tab label="Subscribed" > 
					   <div > 
					    {this._getCollectedChildren()}   
					   </div> 
					 </Tab>
					 <Tab label="History" > 
					   <div > 
					    {this._getHistoryChildren()}   
					   </div> 
					 </Tab>
				</Tabs>
			</AppCanvas> 
		);	
		
	},
	_getCollectedChildren:function(){
		var children=[];
		// console.log(this.state.collectedItems);
		for(var i =this.state.collectedItems.length-1;i>=0;--i){
			var item=this.state.collectedItems[i];
			var CardItem=(<Card key={i} 
				str={'上次看到'}
				index={i} 
				title={item.title} 
				iconUrl={item.iconUrl} 
				lastReaded={item.lastReaded} 
				removeElemet={this._removeCollected}
				site={item.site} 
				indexURL={item.url}/>);
			children.push(CardItem);
		}
		return children;
	},
	_getHistoryChildren:function(){
		var children=[];
		// console.log(this.props.historyItems);
		for(var i =this.state.historyItems.length-1;i>=0;--i){
			var item=this.state.historyItems[i];
			var CardItem=(<Card key={i} 
				str={'上次看到'}
				index={i} 
				title={item.title} 
				iconUrl={item.iconUrl} 
				lastReaded={item.lastReaded} 
				removeElemet={this._removeHistory} 
				site={item.site}
				indexURL={item.url}/>);
			children.push(CardItem);
		}
		return children;	
	},
	_getUpdateChildren:function(){
		var children=[];
		// console.log(this.props.historyItems);
		for(var i =this.state.updateItems.length-1;i>=0;--i){
			var item=this.state.updateItems[i];
			var CardItem=(<Card key={i} 
				str={'更新至'}
				index={i} 
				title={item.title} 
				iconUrl={item.iconUrl} 
				lastReaded={item.lastReaded} 
				removeElemet={this._removeUpdate} 
				site={item.site}
				indexURL={item.url}/>);
			children.push(CardItem);
		}
		return children;	
	},
	_removeCollected:function(e,index){
		var array=[];
		for(var i=0;i<this.state.collectedItems.length;++i){
			if(i!==index){
				array.push(this.state.collectedItems[i]);
			}
		}
		chrome.storage.local.set({collected:array});
		this.setState({collectedItems:array});
	},
	_removeHistory:function(e,index){
		var array=[];
		for(var i=0;i<this.state.historyItems.length;++i){
			if(i!==index){
				array.push(this.state.historyItems[i]);
			}
		}
		chrome.storage.local.set({readed:array});
		this.setState({historyItems:array});
	},
	_removeUpdate:function(e,index){
		var array=[];
		for(var i=0;i<this.state.updateItems.length;++i){
			if(i!==index){
				array.push(this.state.updateItems[i]);
			}
		}
		chrome.storage.local.set({update:array});
		this.setState({updateItems:array});
		var badgeText=(array.length===0)?"":array.length.toString();
      	chrome.browserAction.setBadgeText({text:badgeText});
	}
 
});

React.render(<Cards />, document.body);
