'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
// const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss')
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const ghpages = require('gh-pages');

const browserSync = require('browser-sync').create();

// function scss() {
//   return src('src/css/app.scss')
//     .pipe(sourcemaps.init())
//     .pipe(sass.sync().on('error', sass.logError))
//     .pipe(
//       cleanCSS({
//         compatibility: 'ie8'
//       })
//     )
//     .pipe(sourcemaps.write('.'))
//     .pipe(dest('dist'))
//     .pipe(browserSync.stream());
// };

function css() {
  return src([
    "src/css/reset.css",
    "src/css/typography.css",
    "src/css/app.css"
  ])
    .pipe(sourcemaps.init())
    .pipe( 
      postcss([ 
        require('autoprefixer'), 
        require('postcss-preset-env')({
          stage: 1,
          browsers: ['IE 11', 'last 2 versions']
        }) 
      ]) 
    )
    .pipe(concat('app.css'))
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
  // watch('src/css/app.scss', scss);
  watch('src/css/*.css', css);
  watch('src/fonts/*', fonts);
  watch('src/img/*', images);
}

function deploy(done) {
  ghpages.publish('dist', function(err) {});
  done();
};

exports.deploy = deploy;

exports.default = series(
  parallel(html, css, fonts, images),
  watchFiles
);