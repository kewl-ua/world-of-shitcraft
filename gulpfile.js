const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const dartSass = require('sass');
const autoprefixer = require('gulp-autoprefixer').default;
const browserSync = require('browser-sync').create();

const sass = gulpSass(dartSass);

function styles(cb) {
    gulp.src('./scss/index.scss')
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest('./css'));

    cb();
}

function serve(cb) {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    cb();
}

function watch(cb) {
    gulp.watch('./scss/**/*.scss', { ignoreInitial: false }, styles);
    gulp.watch(['./index.html', 'css/*', 'js/*'])
        .on('change', browserSync.reload);

    cb();
}

module.exports = {
    default: gulp.series(styles, watch, serve),
    styles
};
