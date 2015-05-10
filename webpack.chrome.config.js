var Path=require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack=require('webpack');
module.exports={
	entry:{
		app_min:'./src/app/app.jsx',
		background:'./src/background.js',
		popup_min:'./src/popup.jsx'
	},
	output:{
		path:Path.resolve(__dirname,'ComicsScroller/'),
		filename: 'js/[name].js'
	},
	module:{
		loaders:[{
			test:/\.jsx?$/,
			loader: 'babel',
			query: {compact: false,blacklist: ["useStrict"]}
		},{
			test:/\.less$/,
			loader: ExtractTextPlugin.extract('style-loader','css-loader!less-loader')
		},{
			test:/\.css$/,
			loader: ExtractTextPlugin.extract('style-loader','css-loader')
		},{
			test: /\.(png|jpg)$/, 
			loader: 'url-loader?limit=8192'
		},{ test: /\.(ttf|eot|svg)$/, 
			loader: 'url-loader?limit=100000' }
		]
	},
	plugins: [
        new ExtractTextPlugin('css/[name].css')
    ]
}