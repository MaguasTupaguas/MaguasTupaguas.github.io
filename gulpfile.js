var gulp = require('gulp');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var del = require('del');
var plumber = require('gulp-plumber');
var cp = require('child_process');
var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

gulp.task('js', ['jsdel'], function(){
  return gulp.src('./app/src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app/assets/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  });
});

gulp.task('sass', function(){
    return gulp.src('./app/src/sass/main.scss')
      .pipe(sourcemaps.init())
      .pipe(sass()
        .on('error', sass.logError)
       )
      .pipe(autoprefixer())
      //.pipe(minifyCss())
      .pipe(gulp.dest('./app/assets/css'))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./app/assets/maps'))
      .pipe(browserSync.reload({
        stream: true
      }));
});

gulp.task('html', function(){
    return gulp.src('./app/src/jade/*.jade')
      .pipe(plumber())
      .pipe(jade())
      .pipe(htmlmin())
      .pipe(plumber.stop())
      .pipe(gulp.dest('./app'))
      .pipe(browserSync.reload({
        stream: true
      }));
});

gulp.task('jsdel', function(){
  return del([
    './app/assets/js/*.js'
  ]);
});

gulp.task("default", ['html', 'js', 'sass','browserSync'], function(){
  gulp.watch('./app/src/jade/*.jade', ["html"]);
  gulp.watch('./app/src/js/*.js', ["js"]);
  gulp.watch('./app/src/sass/**/*.scss', ["sass"]);

});
