var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-ruby-sass'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr(),
    jsSrcs = {
      srcs: '_/scripts/*.js',
      main: '_/scripts/app.js'
    },
    sassSrcs = {
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

