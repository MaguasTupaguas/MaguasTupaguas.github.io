var gulp = require('gulp');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var jade = require('gulp-jade');
//var sourcemaps = require('gulp-sourcemaps');
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
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});



gulp.task('browserSync', ['jekyll-build'] , function(){
  browserSync.init({
    server: {
      baseDir: '_site'
    },
    notify: false
  });
});

gulp.task('sass', function(){
    return gulp.src('assets/css/main.scss')
      .pipe(sass({
          includePaths: ['css'],
          onError: browserSync.notify
      }))
      .pipe(autoprefixer())
      .pipe(minifyCss())
      .pipe(gulp.dest('_site/assets/css'))
      .pipe(browserSync.reload({stream:true}))
      .pipe(gulp.dest('assets/css'));
});

gulp.task('html', function(){
    return gulp.src('_jadefiles/*.jade')
      .pipe(jade())
      .pipe(gulp.dest('_includes'))
      .pipe(browserSync.reload({
        stream: true
      }));
});


gulp.task('js', ['jsdel'], function(){
  return gulp.src('assets/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('functions.js'))
    .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('jsdel', function(){
  return del([
    './app/assets/js/*.js'
  ]);
});


gulp.task("default", ['html', 'sass', 'js', 'browserSync'], function(){
  gulp.watch('assets/css/**', ['sass']);
  gulp.watch('assets/js/*.js', ['js']);
  gulp.watch('_jadefiles/*.jade', ["html"]);
  gulp.watch(['index.html', '_layouts/*.html', '_includes/*'], ['jekyll-rebuild']);

});
