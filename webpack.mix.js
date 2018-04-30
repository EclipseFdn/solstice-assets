let mix = require('laravel-mix');
mix.options({uglify: {uglifyOptions: {compress: false, output: {comments: true}}}});
mix.setPublicPath('dist');
mix.setResourceRoot('../');

// Default CSS
mix.less('less/quicksilver/styles.less', 'dist/css/quicksilver.css');
mix.less('less/quicksilver/jakarta/styles.less', 'dist/css/jakarta.css');
mix.less('less/quicksilver/eclipse-ide/styles.less', 'dist/css/eclipse-ide.css');
mix.less('less/solstice/_barebone/styles.less', 'dist/css/barebone.css');
mix.less('less/solstice/_barebone/footer.less', 'dist/css/barebone-footer.css');
mix.less('less/solstice/table.less', 'dist/css/table.css');
mix.less('less/solstice/locationtech/styles.less', 'dist/css/locationtech.css');
mix.less('less/solstice/locationtech/barebone.less', 'dist/css/locationtech-barebone.css');
mix.less('less/solstice/polarsys/styles.less', 'dist/css/polarsys.css');
mix.less('less/solstice/polarsys/barebone.less', 'dist/css/polarsys-barebone.css');
mix.less('less/solstice/styles.less', 'dist/css/solstice.css');

// Drupal sites
mix.less('less/solstice/drupal.less', 'dist/css/drupal-solstice.css');

// JavaScript
mix.scripts([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
    './node_modules/feather-icons/dist/feather.min.js',
    './js/solstice.js'
], 'dist/js/solstice.js');