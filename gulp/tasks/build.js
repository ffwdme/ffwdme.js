var gulp = require('gulp');

gulp.task('build', ['browserify', 'static', 'sass', 'assets']);
