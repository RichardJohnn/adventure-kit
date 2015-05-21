var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var concatCss = require('gulp-concat-css');
var nodemon = require('gulp-nodemon');

gulp.task('default', ['serve']);

gulp.task('js', function () {
  var b = browserify({
    entries: 'public/js/app.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('all.js'))
    .pipe(buffer())
    .pipe(gulp.dest('public/dist/js'));
});

gulp.task('css', function () {
  return gulp.src('public/css/**/*.css')
    .pipe(concatCss('all.css'))
    .pipe(gulp.dest('public/dist/css'));
});

gulp.task('serve', ['js', 'css'], function () {
  nodemon({
    script: 'bin/www',
    ext: 'ejs js css',
    ignore: ['./public/js/all.js'],
    tasks: ['js', 'css']
  });
});