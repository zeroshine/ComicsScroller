var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var postcssNested = require('postcss-nested');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8000',
      'webpack/hot/only-dev-server',
      './src/js/index'
    ],
    popup: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8000',
      'webpack/hot/only-dev-server',
      './src/js/popup'
    ]
  },
  output: {
    path: path.join(__dirname, 'ComicsSroller'),
    filename: '[name].js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: path.join(__dirname, 'node_modules'),
      query: {
        cacheDirectory: true
      }
    },{
      test: /\.json$/,
      loader: 'json-loader'
    },{
      test: /\.css$/,
      use: [
        {
          loader: 'style-loader',
          options: {
            singleton: true
          }
        }, {
          loader: 'css-loader',
          options: {
            autoprefixer: false,
            sourceMap: true,
            modules: true,
            importLoaders: 1,
            localIdentName: '[name]__[local]__[hash:base64:5]'
          }
        }, {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: () => [
              postcssNested,
            ]
          }
        }
      ]
    }, {
      test: /\.svg$/,
      use: [
        'babel-loader',
        'react-svg-loader'
      ]
    }]
  },
  resolve: {
    alias:{
      css: path.join(__dirname, 'src/css'),
      imgs: path.join(__dirname, 'src/imgs'),
      cmp: path.join(__dirname, 'src/js/component')
    },
    extensions: ['.js', '.jsx', '.json', '.css']
  }
};
