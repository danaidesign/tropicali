'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');

const browserSync = require('browser-sync').create();

function scss() {
  return src('src/css/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(
      cleanCSS({
        compatibility: 'ie8'
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
};

function html() {
  return src('src/*.html')
    .pipe(dest('dist'))
};

function fonts() {
  return src('src/fonts/*')
    .pipe(dest('dist/fonts'))
};

function images() {
  return src('src/img/*')
    .pipe(imagemin())
    .pipe(dest('dist/img'))
};

function watchFiles() {
  browserSync.init({
    server: {
        baseDir: "dist"
    }
  });

  watch('src/*.html', html).on('change', browserSync.reload);
  watch('src/css/app.scss', scss);
  watch('src/fonts/*', fonts);
  watch('src/img/*', images);
}

exports.default = series(
  parallel(html, scss, fonts, images),
  watchFiles
);