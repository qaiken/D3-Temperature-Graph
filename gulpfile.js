var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sass = require('gulp-ruby-sass');
var browserify = require('gulp-browserify');
var livereload = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();
var jsSrcs = {
  srcs: '_/scripts/*.js',
  main: '_/scripts/app.js'
};
var sassSrcs = {
  srcs: '_/scss/*.scss',
  main: '_/scss/styles.scss'
};

gulp.task('js', function() {
  gulp.src(jsSrcs.main)
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(livereload());
});

gulp.task('sass', function() {
  gulp.src(sassSrcs.main)
    .pipe(sass({style: 'compressed'}))
      .on('error', gutil.log)
    .pipe(gulp.dest('css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  var server = livereload();
  gulp.watch(jsSrcs.srcs, ['js']);
  gulp.watch(sassSrcs.srcs, ['sass']);
  gulp.watch(['js/script.js', '*.html'], function(e) {
    server.changed(e.path);
  });
});

gulp.task('default', ['sass','js', 'watch']);
