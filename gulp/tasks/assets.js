var gulp = require('gulp');

gulp.task('assets', function() {
  return gulp.src('./src/**/*.{png,svg,json,m4a,mp3,ogg,wav}')
    .pipe(gulp.dest('build'));
});
