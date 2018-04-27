let mix = require('laravel-mix');
mix.setPublicPath('dist');
mix.less('less/quicksilver/styles.less', 'dist/stylesheets/quicksilver.min.css');
mix.less('less/quicksilver/jakarta/styles.less', 'dist/stylesheets/jakarta.min.css');
mix.less('less/quicksilver/eclipse-ide/styles.less', 'dist/stylesheets/eclipse-ide.min.css');
mix.less('less/solstice/_barebone/styles.less', 'dist/stylesheets/barebone.min.css');
mix.less('less/solstice/_barebone/footer.less', 'dist/stylesheets/barebone-footer.min.css');
mix.less('less/solstice/table.less', 'dist/stylesheets/table.min.css');
mix.less('less/solstice/locationtech/styles.less', 'dist/stylesheets/locationtech.min.css');
mix.less('less/solstice/locationtech/barebone.less', 'dist/stylesheets/locationtech-barebone.min.css');
mix.less('less/solstice/polarsys/styles.less', 'dist/stylesheets/polarsys.min.css');
mix.less('less/solstice/polarsys/barebone.less', 'dist/stylesheets/polarsys-barebone.min.css');
mix.less('less/solstice/styles.less', 'dist/stylesheets/styles.min.css');