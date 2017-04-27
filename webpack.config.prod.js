const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const postcssNested = require('postcss-nested');
const BabiliPlugin = require('babili-webpack-plugin');

module.exports = {
  entry: {
    app: [
      './src/js/index',
    ],
    popup: [
      './src/js/popup',
    ],
  },
  output: {
    path: path.join(__dirname, 'ComicsScroller'),
    filename: 'js/[name].js',
  },
  plugins: [
    new LodashModuleReplacementPlugin({
      collections: true,
      paths: true,
      currying: true,
      shorthands: true,
      caching: true,
      coercions: true,
      guards: true,
      flattening: true,
      memoizing: true,
      chaining: true,
      metadata: true,
      placeholders: true,
    }),
    new ExtractTextPlugin('css/[name].css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BABEL_ENV: JSON.stringify('production'),
      },
    }),
    new BabiliPlugin({}),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: path.join(__dirname, 'node_modules'),
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract([
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[name]__[local]__[hash:base64:5]',
            sourceMap: true,
            minimize: true,
          },
        }, {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: () => [
              postcssNested,
            ]
          }
        }
      ]),
    }, {
      test: /\.svg$/,
      use: [
        'babel-loader',
        'react-svg-loader'
      ],
    }],
  },
  resolve: {
    alias: {
      css: path.join(__dirname, 'src/css'),
      imgs: path.join(__dirname, 'src/imgs'),
      cmp: path.join(__dirname, 'src/js/component'),
    },
    extensions: ['.js', '.jsx', '.json', '.css'],
  },
};
