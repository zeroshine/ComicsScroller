var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/js/background.js',
  ],
  output: {
    path: path.join(__dirname, 'ComicsScroller/js'),
    filename: 'background.js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader?cacheDirectory',
      include: path.join(__dirname, 'src'),
      exclude: path.join(__dirname, 'node_modules')
    },{
      test: /\.json$/,
      loader: 'json'
    }]
  },
  resolve: {
    alias:{
      css: path.join(__dirname, 'src/css'),
      imgs: path.join(__dirname, 'src/imgs')
    },
    extensions: ['.js', '.jsx', '.json', '.css']
  }
};