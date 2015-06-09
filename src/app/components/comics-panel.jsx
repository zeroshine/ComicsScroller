var React = require('react');


var ComicsImage=React.createClass({

	getInitialState:function(){
		var style={
			display:'block',
			maxWidth:'100%',
			margin:'auto',
			marginTop:10,
			marginBottom:50,
			background: '#2a2a2a url(http://i.imgur.com/msdpdQm.gif) no-repeat center center'
		}
		return {realsrc:"../img/Transparent.gif",style:style};
	},

	componentDidMount:function(){
		this.props.transform(this.props.presrc,(src)=>this.setState({realsrc:src})};
	},

	_resizeImg:function(e){
		var img=React.findDOMNode(e.target);
		if(img.natureHeight===1) reutrn;
		if(img.natureWidth/img.natureHeight>1){
			var style=this.state.style;
			var h=window.innerHeight-58;
          	style.maxHeight=h.toString()+'px';
          	style.width=Math.round(h*(elem.naturalWidth)/(elem.naturalHeight)).toString()+'px';
          	this.setState({style:style});
			this.props.updateHeight(this.props.index);	
		}
	},
	
	render:function(){
		return (
			<img style={this.props.style} src={this.state.realsrc} onload={this.resizeImg}/>
		);
	}
});

var isScroll=false;
var debounce=true;
var poll;
var Comics_panel=React.createClass({
	
	getInitialState:function(){
		return {
			beginIndex:0,
			endIndex:6,
			lowerBound:0,
			higherBound:0,
			nowChapter:""
		};
	},
	
	_getImg:function(displays){
		var imgList=[];
		for(var i=0;i<=displays.length;++i){
			var ComicsImage=(
				<ComicsImage presrc={displays[i].src} 
				updateHeight={this._changeImgHeight} 
				index={this.state.beginIndex+i}
				chapter={displays[i].chapter} 
				transform={this.props.renderfunction} />
			);
			imgList.push(ComicsImage);
		}

		return imgList;
	},
	
	_handleScroll:function(){
		if(!useDebounce && !!poll) return;
		clearTimeout(poll);
		poll=setTimeout(function(){
			var st=React.findDOMNode(this.refs.panel).scrollTop;
			if(st<this.props.lowerBound&&this.state.beginIndex!==0){
				this._moveBack();
			}
			if(st>this.props.higherBound&&this.state.endIndex!==this.props.imgItems.length){
				this._moveNext();	
			}
			if(this.state.nowChapter===this.props.lastChapter){
				this.props.loadNextChapter();
			}
			poll=null;	
		}.bind(this),200);
	},
	
	_changeImgHeight:function(index){
		this.props.changImgHeight(index);
	},

	_moveBack:function(){
		if(this.state.beginIndex-2>=0){
			var lowerBound=0;
			for(var i=this.state.beginIndex-2;i<this.state.beginIndex;++i){
				lowerBound+=this.props.imgItems[i].height;
			}
			var higherBound=lowerBound;
			for(var i=this.state.beginIndex;i<this.state.endIndex-4;++i){
				higherBound+=this.props.imgItems[i].height;
			}
			this.setState({
				beginIndex:this.state.beginIndex-2,
				endIndex:this.state.endIndex-2,
				lowerBound:lowerBound,
				higherBound:higherBound
			});	
		}else{
			var lowerBound=0;
			for(var i=0;i<2;++i){
				lowerBound+=this.props.imgItems[i].height;
			}
			var higherBound=lowerBound;
			for(var i=2;i<4++i){
				higherBound+=this.props.imgItems[i].height;
			}
			this.setState({
				beginIndex:0,
				endIndex:6,
				lowerBound:lowerBound,
				higherBound:higherBound
			});
		}
	},

	_moveNext:function(){
		if(this.state.endIndex+2<this.props.imgItems.length){
			var lowerBound=0;
			for(var i=this.state.beginIndex-2;i<this.state.beginIndex;++i){
				lowerBound+=this.props.imgItems[i].height;
			}
			var higherBound=lowerBound;
			for(var i=this.state.beginIndex;i<this.state.endIndex-2;++i){
				higherBound+=this.props.imgItems[i].height;
			}
			this.setState({
				beginIndex:this.state.beginIndex+2,
				endIndex:this.state.endIndex+2
			});	
		}else if(this.state.endIndex!==this.props.imgItems.length){
			var len=this.props.imgItems.length
			var lowerBound=0;
			for(var i=len-6;i<len-4;++i){
				lowerBound+=this.props.imgItems[i].height;
			}
			var higherBound=lowerBound;
			for(var i=len-4;i<len-2;++i){
				higherBound+=this.props.imgItems[i].height;
			}
			this.setState({
				beginIndex:len-6,
				endIndex:len,
				lowerBound:lowerBound,
				higherBound:higherBound
			});
		}
	},

	render:function(){
		var displays=this.props.imgItems.slice(this.state.beginIndex,this.state.endIndex);
		var style={
			paddingTop:64,
			displays:'block',
			backgroundColor:'#2a2a2a',
			minHeight: '100vh';
		};
		return (
			<div style={style} ref='panel' onScroll={this._handleScroll}>
				{this._getImg(displays)}
			</div>
		)
	}

});