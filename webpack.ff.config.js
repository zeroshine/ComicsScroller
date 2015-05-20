var Path=require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack=require('webpack');
module.exports={
	entry:{
		app_min:'./src/app/app_ff.jsx'
	},
	output:{
		path:Path.resolve(__dirname,'ComicsScroller_ff/'),
		filename: 'data/[name].js'
	},
	module:{
		loaders:[{
			test:/\.jsx?$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {stage:1,compact: false,blacklist: ["useStrict"],optional:["runtime"]}
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
	// externals:[
	// 	"sdk/simple-storage"
	// ],
	plugins: [
        new ExtractTextPlugin('data/[name].css'),
    ],
    devtool:"#inline-source-map"
}