/*!
 * Copyright (c) 2021 Eclipse Foundation, Inc.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * Contributors:
 *   Christopher Guindon <chris.guindon@eclipse-foundation.org>
 *
 * SPDX-License-Identifier: EPL-2.0
 */


let mix = require('laravel-mix');
require('laravel-mix-transpile-node-modules');
mix.transpileNodeModules(['eclipsefdn-solstice-assets']);

class EclipseFdnSolsticeAssets {

  register() {
      console.log('Loading eclipsefdn-solstice-assets default configurations.');
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
