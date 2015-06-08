var React = require('react');


var ComicsImage=React.createClass({
	getInitialState:function(){
		return {realsrc:"../img/Transparent.gif"}
	},
	componentDidMount:function(){
		this.props.transform(this.props.presrc,(src)=>this.setState({realsrc:src})};
	},
	render:function(){
		return (
			<img src={this.state.realsrc} />
		)
	}
});

var isScroll=false;
var Comics_panel=React.createClass({
	
	getInitialState:function(){
		return {beginIndex:0,endIndex:4};
	},
	
	_getImg:function(displays){
		var imgList=[];
		for(var i=0;i<=displays.length;++i){
			var ComicsImage=(
				<ComicsImage presrc={displays[i]} transform={this.props.renderfunction} />
			);
			imgList.push(ComicsImage);
		}
		return imgList;
	},
	
	_handleScroll:function(){
		clearTimeout(poll);
		poll=setTimeout(function(){
			var st=React.findDOMNode(this.refs.panel).scrollTop;
			if(st<this.state.lowerBound){
				this._moveBack();
			}
			if(st>this.state.higherBound){
				this._moveNext();	
			}
		
		},200);

	},
	
	_changeBoun

	render:function(){
		var displays=this.props.imgItems.slice(this.state.beginIndex,this.state.endIndex);
		return (
			<div ref='panel' onScroll={this._handleScroll}>
				{this._getImg(displays)}
			</div>
		)
	}

});