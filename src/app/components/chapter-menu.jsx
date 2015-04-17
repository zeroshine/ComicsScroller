var React = require('react'),
	mui = require('material-ui');
var Menu=mui.Menu;
var PureRenderMixin = React.addons.PureRenderMixin;  
var ChapterMenu=React.createClass({
	mixins: [PureRenderMixin], 
	render:function(){
		return(
			<div className="chapter-menu">
				<Menu menuItems={this.props.menuItems} autoWidth={false} onItemClick={this.props.onItemClick} selectedIndex={this.props.selectedIndex}/>
			</div>
		);
	},
});

module.exports=ChapterMenu;