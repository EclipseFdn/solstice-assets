let mix = require('laravel-mix');
require('laravel-mix-transpile-node-modules');
mix.transpileNodeModules(['eclipsefdn-solstice-assets']);

class EclipseFdnSolsticeAssets {

  register() {
      console.log('mix.SolsticeAssets() was called.');
  }

  webpackConfig(config) {
    config.module.rules.unshift( {
      test: /\.mustache$/,
      loader: 'mustache-loader',
    });

    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['jquery'] = 'jquery/src/jquery';
  }
}

mix.extend('EclipseFdnSolsticeAssets', new EclipseFdnSolsticeAssets());
