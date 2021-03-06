var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

function styles(cb) {
    gulp.src('./scss/index.scss')
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer(['last 30 versions']))
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
