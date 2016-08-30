const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const AP_ANGULAR_DEFAULT_DEBOUNCE = 300;
const AP_ANGULAR_DEFAULT_BLUR = 0;
const HOST_LOCATION = 'http://localhost:8080/';

const commonsPlugins = [
  new HtmlWebpackPlugin({
    template: './src/app/index.html',
  }),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.DefinePlugin({
    AP_ANGULAR_DEFAULT_DEBOUNCE,
    AP_ANGULAR_DEFAULT_BLUR,
  }),
];

module.exports = {
  PROJECT_DIR: __dirname,
  HOST_LOCATION,
  WEBPACK_PLUGINS: {
    dev: [
      new BrowserSyncPlugin(
        {
          host: 'localhost',
          port: 3000,
          proxy: HOST_LOCATION,
        },
        {
          reload: false,
        }
      ),
      new webpack.HotModuleReplacementPlugin(),
      ...commonsPlugins,
    ],
    prod: [
      new ExtractTextPlugin('styles.css'),
      new webpack.IgnorePlugin(/^(.*spec.*)$/),
      new webpack.optimize.UglifyJsPlugin({
        comments: false,
        beautify: false,
        compress: {
          warnings: false,
        },
      }),
      ...commonsPlugins,
    ],
    test: [new webpack.DefinePlugin({
      AP_ANGULAR_DEFAULT_DEBOUNCE,
      AP_ANGULAR_DEFAULT_BLUR,
    })],
  },
};
