/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/
var gulp          = require('gulp');
var browserify    = require('browserify');
var watchify      = require('watchify');
var bundleLogger  = require('../util/bundle_logger');
var handleErrors  = require('../util/handle_errors');
var source        = require('vinyl-source-stream');
var buffer        = require('vinyl-buffer');
var uglify        = require('gulp-uglify');
var rename        = require('gulp-rename');
var header        = require('gulp-header');

var pkg = require('../../package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @copyright <%= pkg.copyright %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('browserify', function() {
  var bundles = [];

  var baseConfig = {
    // Specify the entry point of your app
    entries: [],
    // Add file extentions to make optional in your requires
    extensions: ['.js'],
    // Enable source maps!
    debug: true
  };

  function setupBundle(inputFile, outputFile) {
    var config = Object.create(baseConfig);
    config.entries = [inputFile];
    var bundler;

    if (global.isWatching) {
      config = Object.assign(config, watchify.args);
      bundler = watchify(browserify(config));
    } else {
      bundler = browserify(config);
    }

    function bundle() {
      // Log when bundling starts
      bundleLogger.start();

      return bundler
        .bundle()
        .on('error', handleErrors)
        // browserify normal version
        .pipe(source(outputFile))
        .pipe(buffer())
        .pipe(header(banner, { pkg : pkg }))
        .pipe(gulp.dest('./build/'))
        // minified version
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('./build/'))
        // done
        .on('end', bundleLogger.end);
    }

    if (global.isWatching) {
      // Rebundle with watchify on changes.
      bundler.on('update', bundle);
    }

    return bundle();
  }

  bundles.push(setupBundle('./src/core/index.js', 'ffwdme-core.js'));
  bundles.push(setupBundle('./src/debug/index.js', 'ffwdme-debug.js'));
  bundles.push(setupBundle('./src/components/index.js', 'ffwdme-components.js'));

  // return bundle();
});
