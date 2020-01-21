//
// npm module
//===============================================
var gulp = require('gulp');
var sass = require('gulp-sass')
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var cmq = require('gulp-group-css-media-queries');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var mozjpeg = require('imagemin-mozjpeg');
var sync  = require('browser-sync');
var ssi   = require('connect-ssi');
var postcss = require('gulp-postcss');
var cssdeclsort = require('css-declaration-sorter');


//
// config
//===============================================
var SUPPORT_BROWSERS = ['last 2 versions', 'ie 11', 'ios >= 10', 'last 2 ChromeAndroid versions'];
var srcDir = {
  'sass': '../sass/**/*.scss',
  'image': '../../img/*.jpg'
};
var destDir = {
  'css': '../../css/',
  'image': '../../img/'
};

//
// Task
//===============================================
//CSS
gulp.task('sass', function () {
  return gulp.src(srcDir['sass'])
    .pipe(plumber())
    .pipe(sass({style : 'expanded'}).on('error', notify.onError( error => { return error.message; })))
    .pipe(postcss([cssdeclsort({order: 'smacss'})]))
    .pipe(cmq())
    .pipe(autoprefixer({
      overrideBrowserslist:SUPPORT_BROWSERS,
      cascade: false
    }))

    //rename, compress and output
    // .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(destDir['css']))
});

//local host
gulp.task('serve', done => {
  sync.init({
      server: {
          baseDir: '../../',
          index: 'index.html',
      },
  })
  done()
});

//file monitoring
gulp.task('watch', function() {
  const browserReload = done => {
    sync.reload()
    done()
  }

  // scss
  gulp.watch('../../**/*', browserReload);
  gulp.watch(srcDir['sass'], gulp.series('sass'));
});

//default
gulp.task('default', gulp.series('serve', 'watch'));
// gulp.task('default', gulp.series('watch'));

//compress images
gulp.task('imagemin', function () {
  return gulp.src(srcDir['image'])
    .pipe(
      imagemin([
        mozjpeg({
          quality: 80,
          progressive: true
        })
      ]))
    .pipe(gulp.dest(destDir['image']));
});