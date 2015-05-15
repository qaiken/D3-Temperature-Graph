var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-ruby-sass'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr(),
    jsSources = [
      '_/scripts/*.js'
    ],
    sassSources = [
      '_/scss/*.scss'
    ];

gulp.task('js', function() {
  gulp.src(jsSources)
          .pipe(uglify())
          .pipe(concat('script.js'))
          .pipe(gulp.dest('js'));
});

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true})
      .on('error', gutil.log))
    .pipe(gulp.dest('_/scripts'))
});

gulp.task('sass', function() {
  gulp.src('_/scss/styles.scss')
    .pipe(sass({style: 'compressed'}))
      .on('error', gutil.log)
    .pipe(concat('style.css'))
    .pipe(gulp.dest('css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  var server = livereload();
  gulp.watch(jsSources, ['js']);
  gulp.watch(sassSources, ['sass']);
  gulp.watch(['js/script.js', '*.html'], function(e) {
    server.changed(e.path);
  });
});

gulp.task('default', ['sass','js', 'watch']);

