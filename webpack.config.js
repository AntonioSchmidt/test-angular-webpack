const settings = require('./settings.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
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
  const ENV = process.env.NODE_ENV;
  const isProd = ENV === 'prod';
  const isDev = ENV === 'dev';
  const bootstrapEntryPoint = isProd ? 'bootstrap-loader/extractStyles' : 'bootstrap-loader';
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
    plugins: settings.WEBPACK_PLUGINS[ENV],
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
  } else {
    if (isDev) {
      config.module.loaders.push(inlineSassLoader);
      config.module.loaders.push(inlineCssLoader);
      config.devtool = 'inline-source-map';
    }
    config.entry.unshift(`webpack-dev-server/client?${settings.HOST_LOCATION}`,
      'webpack/hot/dev-server');
    config.devServer = {
      hot: true,
      contentBase: '/dist/',
      stats: {
        colors: true,
      },
    };
  }
  return config;
}());
