var path = require('path');
var webpack = require('webpack');
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
  entry: ['./src/js/background.js'],
  output: {
    path: path.join(__dirname, 'ComicsScroller/js'),
    filename: 'background.js',
  },
  plugins: process.env.NODE_ENV === 'production' ? [new MinifyPlugin({})] : [],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader?cacheDirectory',
        include: path.join(__dirname, 'src'),
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
  resolve: {
    alias: {
      css: path.join(__dirname, 'src/css'),
      imgs: path.join(__dirname, 'src/imgs'),
    },
    extensions: ['.js', '.jsx', '.json', '.css'],
  },
};
