/*!
 * Copyright (c) 2018 Eclipse Foundation, Inc.
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
mix.options({
  uglify: { uglifyOptions: { compress: false, output: { comments: true } } },
});
mix.setPublicPath('docs/dist');
mix.setResourceRoot('../');

// Copy the logo from src'
mix.copy(
  'images/logo/eclipse-foundation-white-orange.svg',
  'docs/dist/images/logo/eclipse-foundation-white-orange.svg'
);
mix.copy(
  'images/template/placeholders',
  'docs/dist/images/template/placeholders'
);

// Default CSS
mix.less('less/quicksilver/styles.less', 'docs/dist/css/quicksilver.css');
mix.less('less/quicksilver/jakarta/styles.less', 'docs/dist/css/jakarta.css');
mix.less(
  'less/quicksilver/eclipse-ide/styles.less',
  'docs/dist/css/eclipse-ide.css'
);
mix.less('less/solstice/_barebone/styles.less', 'docs/dist/css/barebone.css');
mix.less(
  'less/solstice/_barebone/footer.less',
  'docs/dist/css/barebone-footer.css'
);
mix.less('less/solstice/table.less', 'docs/dist/css/table.css');
mix.less('less/solstice/styles.less', 'docs/dist/css/solstice.css');

// Copy cookieconsent files
mix.copy(
  'node_modules/cookieconsent/build/cookieconsent.min.css',
  'docs/dist/css/vendor/cookieconsent.min.css'
);
mix.copy(
  'node_modules/cookieconsent/src/cookieconsent.js',
  'docs/dist/js/vendor/cookieconsent.min.js'
);

// Drupal sites
mix.less('less/solstice/drupal.less', 'docs/dist/css/drupal-solstice.css');
mix.less(
  'less/quicksilver/newsletter/drupal.less',
  'docs/dist/css/newsletter.css'
);

mix.webpackConfig({
  resolve: {
    alias: {
      jquery: 'jquery/src/jquery',
    },
  },
});

mix.js(['js/main.js'], 'docs/dist/js/solstice.js');
