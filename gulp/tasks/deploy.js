var gulp = require('gulp');
var awspublish = require('gulp-awspublish');
var handleErrors = require('../util/handle_errors');

gulp.task('deploy', ['build'], function() {
  var secrets = require('../../secrets.json');
  var publisher = awspublish.create({
    key:    secrets.aws.key,
    secret: secrets.aws.secret,
    bucket: secrets.aws.bucket
  });

  // weak caching, for debugging
  var headers = {
    'Cache-Control': 'max-age=120, no-transform, public'
  };

  return gulp.src('./build/**')
     // gzip, Set Content-Encoding headers
    .pipe(awspublish.gzip())
    // publisher will add Content-Length, Content-Type and headers specified above
    // If not specified it will set x-amz-acl to public-read by default
    .pipe(publisher.publish(headers))
    .on('error', handleErrors)
    // Delete old files
    .pipe(publisher.sync())
    // create a cache file to speed up consecutive uploads
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});
