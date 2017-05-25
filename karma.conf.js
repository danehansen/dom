var webpackConfig = require('./webpack.config.js');
webpackConfig.module.rules[0].use.unshift(
{
  loader: 'istanbul-instrumenter-loader',
  options: {
    esModules: true,
  },
});
delete webpackConfig.output;
delete webpackConfig.entry;
delete webpackConfig.externals;

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['mocha', 'chai', 'sinon'],
    reporters: ['coverage-istanbul'],
    files: [
      'test/test.js',
    ],
    preprocessors: {
      'test/test.js': ['webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only',
    },
    coverageIstanbulReporter: {
      reports: ['html'],
      dir: 'coverage',
    },
  })
}
