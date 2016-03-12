var Path=require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack=require('webpack');
module.exports={
	devtool: 'source-map',
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
			test: /\.(png|jpg|gif)$/, 
			loader: 'url-loader?limit=8192'
		},{ test: /\.(ttf|eot|svg)$/, 
			loader: 'url-loader?limit=100000' }
		]
	},
	plugins: [
        new ExtractTextPlugin('css/[name].css'),
        new webpack.optimize.UglifyJsPlugin({
		      mangle: true,
	          sourcemap:false,
	          compress: {
	            sequences: true,
	            dead_code: true,
	            booleans: true,
	            drop_console: true,
	            properties: true,
	            loops:true,
	            if_return:true,
	            comparisons:true,
	            warnings:false
	          }
		})        
    ]
}