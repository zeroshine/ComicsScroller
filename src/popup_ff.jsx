require('./less/popup.less');
var React = require('react');
var mui=require('material-ui');
var Paper=mui.Paper;
var Tab=mui.Tab;
var Tabs=mui.Tabs;
var IconButton=mui.IconButton;
var SvgIcon=mui.SvgIcon;
var injectTapEventPlugin = require("react-tap-event-plugin");
// React.initializeTouchEvents(true);
// var Card=require('./app/components/card.jsx');
injectTapEventPlugin();

var Card=React.createClass({
	render:function(){
		console.log('this.props.indexURL',this.props.indexURL);
		
		switch(this.props.site){
			case 'sf':
				this.siteurl="http://comic.sfacg.com"
				break;
			case 'dm5':
				this.siteurl="http://www.manben.com"
				break;
			case 'comics8':
				this.siteurl="http://www.8comic.com/"
		}
		return(
			<Paper className={'material-card'} key={this.props.index} zDepth={2}>
				<img src={this.props.iconUrl} /> 
				<div className={'material-card-infor'}>
					<h3 className={'card-title-link'} onClick={this._openIndex}>{this.props.title} </h3>	
					<h5 className={'card-site-link'} onClick={this._openSite} >{this.props.site}</h5>
					<h5 className={'card-readed-link'} onClick={this._openPage}>{this.props.str+' '+this.props.lastReaded.text}</h5>				
				</div>
				<div className={'trash'}  onClick={this._removeElemet} >
					<span className={'lid'} />
					<span className={'can'} />
				</div>
			</Paper>
			);

	},
	_removeElemet:function(e){
		this.props.removeElemet(e,this.props.index);
	},
	_openSite:function(){
		self.port.emit('open', this.siteurl);
	},
	_openPage:function(){
		self.port.emit('open',this.props.lastReaded.payload);
	},
	_openIndex:function(){
		self.port.emit('open',this.props.indexURL);
	}

});

var Cards=React.createClass({	
	getInitialState:function(){
		self.port.on('show', (function (msg) {
			var obj = JSON.parse(msg);
			var collectedItems = obj.collected;
			var readedItems = obj.readed;
			var updateItems = obj.update;
			console.log('show to',obj);
			this.setState({
				updateItems: updateItems,
				collectedItems: collectedItems,
				historyItems: readedItems
			});
		}).bind(this));

		return {collectedItems:[],historyItems:[],updateItems:[]};
	},
	componentDidMount:function(){
		var collectedItems = self.options.collected;
		var readedItems = self.options.readed;
		var updateItems = self.options.update;
		this.setState({
			updateItems: updateItems,
			collectedItems: collectedItems,
			historyItems: readedItems
		});
	},
	render:function(){
		var classes='material-popup-container';
		return (
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
		);	
		
	},
	_getCollectedChildren:function(){
		var children=[];
		// console.log(this.props.collectedItems);
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
			console.log('lastReaded',item.lastReaded);
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
		self.port.emit('saveCollected',JSON.stringify(array));
		// localStorage.setItem('collected',JSON.stringify(array));
		
		// chrome.storage.local.set({collected:array});
		this.setState({collectedItems:array});
	},
	_removeHistory:function(e,index){
		var array=[];
		for(var i=0;i<this.state.historyItems.length;++i){
			if(i!==index){
				array.push(this.state.historyItems[i]);
			}
		}
		self.port.emit('saveReaded',JSON.stringify(array));
		// chrome.storage.local.set({readed:array});
		this.setState({historyItems:array});
	},
	_removeUpdate:function(e,index){
		var array=[];
		for(var i=0;i<this.state.updateItems.length;++i){
			if(i!==index){
				array.push(this.state.updateItems[i]);
			}
		}
		self.port.emit('saveUpdate',JSON.stringify(array));
		// chrome.storage.local.set({update:array});
		this.setState({updateItems:array});
		// var badgeText=(array.length===0)?"":array.length.toString();
      	// chrome.browserAction.setBadgeText({text:badgeText});
	}
 
});

React.render(<Cards />, document.body);
