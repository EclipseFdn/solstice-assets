let mix = require('laravel-mix');

mix.webpackConfig({
  entry: ['whatwg-fetch'],
  module: {
    rules: [
      {
        test: /\.mustache$/,
        loader: 'mustache-loader',
      },
    ],
  },
  resolve: {
    alias: {
      jquery: 'jquery/src/jquery',
    },
  },
});
