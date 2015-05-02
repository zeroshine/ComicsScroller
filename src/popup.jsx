var React = require('react');
var mui=require('material-ui');
var Paper=mui.Paper;
var Tab=mui.Tab;
var Tabs=mui.Tabs;
var IconButton=mui.IconButton;
var SvgIcon=mui.SvgIcon;
var injectTapEventPlugin = require("react-tap-event-plugin");

// var Card=require('./app/components/card.jsx');
injectTapEventPlugin();

var Card=React.createClass({
	render:function(){
		console.log('this.props.indexURL',this.props.indexURL);
		return(
			<Paper className={'material-card'} key={this.props.index} zDepth={2}>
				<img src={this.props.iconUrl} /> 
				<div className={'material-card-infor'}>
					<h3 className={'card-title-link'} onClick={this._openIndex}>{this.props.title} </h3>	
					<h5 className={'card-readed-link'} onClick={this._openPage}>{this.props.str+' '+this.props.lastReaded.text}</h5>				
				</div>
				<IconButton className={'material-cancel-button'} iconClassName={'icon-bin'} onClick={this._removeElemet} />
			</Paper>
			);

	},
	_removeElemet:function(e){
		this.props.removeElemet(e,this.props.index);
	},
	_openPage:function(){
		chrome.tabs.create({url:this.props.lastReaded.payload});
	},
	_openIndex:function(){
		console.log('this.props.indexURL',this.props.indexURL);
		chrome.tabs.create({url:this.props.indexURL});
	}

});

var Cards=React.createClass({	
	getInitialState:function(){
		return {collectedItems:[],historyItems:[],updateItems:[]};
	},
	componentDidMount:function(){
		chrome.storage.local.get('collected',function(items){
      		console.log('get collected',items);
      		var urllist=items.collected;
      		this.setState({collectedItems:urllist});
		}.bind(this));
		chrome.storage.local.get('readed',function(items){
      		console.log('get readed',items);
      		var urllist=items.readed;
      		this.setState({historyItems:urllist});
		}.bind(this));
		chrome.storage.local.get('update',function(items){
      		console.log('get update',items);
      		var urllist=items.update;
      		
      		this.setState({updateItems:urllist});
		}.bind(this));
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
			var CardItem=(<Card key={i} 
				str={'上次看到'}
				index={i} 
				title={item.title} 
				iconUrl={item.iconUrl} 
				lastReaded={item.lastReaded} 
				removeElemet={this._removeHistory} 
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
				indexURL={item.url}/>);
			children.push(CardItem);
		}
		return children;	
	},
	_removeCollected:function(e,index){
		var array=[];
		for(var i=0;i>this.state.collectedItems.length;++i){
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
