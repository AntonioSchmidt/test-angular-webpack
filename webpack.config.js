const settings = require('./settings.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const autoprefixer = require('autoprefixer');
const del = require('del');

const inlineSassLoader = {
  test: /\.scss$/,
  loaders: ['style', 'css', 'postcss', 'sass'],
};
const inlineCssLoader = {
  test: /\.css$/,
  loaders: ['style', 'css', 'postcss'],
};

module.exports = (function createConfig() {
  const localhostPath = 'http://localhost:8080/';
  const isProd = process.env.NODE_ENV === 'prod';
  const isDev = process.env.NODE_ENV === 'dev';
  const bootstrapEntryPoint = isDev ? 'bootstrap-loader' : 'bootstrap-loader/extractStyles';
  console.log(`Creating webpack config with ENV: ${process.env.NODE_ENV}`);
  console.log(`Bootstrap entry-point: ${bootstrapEntryPoint}\n`);
  del(['dist/**']).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
  const config = {
    entry: ['font-awesome-loader', bootstrapEntryPoint, './src/app/index.module.js'],
    resolve: {
      root: path.resolve(settings.PROJECT_DIR, './src'),
      modulesDirectories: ['node_modules'],
    },
    output: {
      path: path.resolve(settings.PROJECT_DIR, './dist'),
      filename: 'bundle.[hash].js',
    },
    module: {
      preLoaders: [
        {
          test: /\.js$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
        },
      ],
      loaders: [
        {
          test: /\.js/,
          loaders: ['ng-annotate', 'babel'],
          exclude: /node_modules/,
        },
        {
          test: /\.html$/,
          loader: 'html',
        },
        {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url?limit=10000',
        },
        {
          test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
          loader: 'file',
        },
        { test: /bootstrap-sass\/assets\/javascripts\//,
          loader: 'imports',
        },
      ],
    },
    postcss: [autoprefixer],
    plugins: [
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
        AP_ANGULAR_DEFAULT_DEBOUNCE: settings.AP_ANGULAR_DEFAULT_DEBOUNCE,
        AP_ANGULAR_DEFAULT_BLUR: settings.AP_ANGULAR_DEFAULT_BLUR,
      }),
    ],
    node: {
      fs: 'empty',
    },
  };

  if (isProd) {
    config.module.loaders.push({
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style',
        loader: 'css!postcss!sass',
      }),
    });
    config.module.loaders.push({
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style',
        loader: 'css!postcss',
      }),
    });
    config.plugins.push(new ExtractTextPlugin('styles.css'));
    config.plugins.push(new webpack.IgnorePlugin(/^(.*spec.*)$/));
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
      comments: false,
      beautify: false,
      compress: {
        warnings: false,
      },
    }));
  } else {
    if (isDev) {
      config.devtool = 'inline-source-map';
      config.module.loaders.push(inlineSassLoader);
      config.module.loaders.push(inlineCssLoader);
    }
    config.entry.unshift(`webpack-dev-server/client?${localhostPath}`, 'webpack/hot/dev-server');
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.plugins.push(new BrowserSyncPlugin(
      {
        host: 'localhost',
        port: 3000,
        proxy: localhostPath,
      },
      {
        reload: false,
      }
    ));
    config.devServer = {
      publicPath: config.output.publicPath,
      hot: true,
      contentBase: '/dist/',
      stats: {
        colors: true,
      },
    };
  }
  return config;
}());
