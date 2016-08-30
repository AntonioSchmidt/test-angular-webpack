const webpackConfig = require('./webpack.config.js');

webpackConfig.entry = {};
webpackConfig.devtool = 'eval';
module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    autoWatchBatchDelay: 300,

    files: [
      'specs.webpack.js',
    ],

    coverageReporter: {
      dir: 'dist/coverage/',
      instrumenterOptions: {
        istanbul: { noCompact: true },
      },
      reporters: [
        { type: 'text-summary' },
        { type: 'html' },
      ],
    },

    preprocessors: {
      'specs.webpack.js': ['webpack', 'sourcemap', 'babel'],
    },
    plugins: [
      'karma-coverage',
      'karma-webpack',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-sourcemap-loader',
      'karma-babel-preprocessor'],
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
      stats: {
        colors: true,
        chunks: false,
        modules: false,
        reasons: false,
      },
    },
  });
};
