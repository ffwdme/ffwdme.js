/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browser_sync.js automatically reloads any files
     that change within the directory it's serving from
*/

var gulp = require('gulp');

gulp.task('watch', ['setWatch', 'browserSync'], function() {
  gulp.watch('static/**', ['static']);
  gulp.watch('./src/**/*.scss', ['sass']);
  gulp.watch('./src/**/*.{png,svg,json,m4a,mp3,ogg,wav}', ['assets']);
});
