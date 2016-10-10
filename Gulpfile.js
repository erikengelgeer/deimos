'use strict';

// --production for production

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');


var paths = {
    assets: "app/Resources/assets/",
    web: "web/"
};

paths.libs = [
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/angular/angular.min.js",
    "node_modules/angular-ui-router/release/angular-ui-router.min.js",
    "node_modules/angular-sanitize/angular-sanitize.min.js",
    "node_modules/ngstorage/ngStorage.min.js",
    "node_modules/bootstrap/dist/js/bootstrap.min.js",
    "node_modules/lodash/lodash.min.js",
    "node_modules/moment/min/moment.min.js",
    "node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.js",
];

paths.zxcvbn = [
    "node_modules/zxcvbn/dist/zxcvbn.js",
];

paths.scrips = [
    paths.assets + "js/**"
];

paths.basecss = [
    "node_modules/bootstrap/dist/css/bootstrap.min.css",
];

paths.styles = [
    paths.assets + "styles/**/*.scss"
];

paths.partials = [
    paths.assets + "partials/**"
];

paths.images = [
    paths.assets + "images/**"
];

gulp.task('libs', function () {
    return gulp.src(paths.libs)
        .pipe(concat('libs.min.js'))
        .pipe(gulp.dest(paths.web + "libs"));
});

gulp.task('zxcvbn', function () {
   return gulp.src(paths.zxcvbn)
       .pipe(concat('zxcvbn.min.js'))
       .pipe(gulp.dest(paths.web + "libs"));
});

gulp.task('scripts', function () {
    return gulp.src(paths.scrips)
        .pipe(gulpif(argv.production, uglify()))
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(paths.web + "app"));
});

gulp.task('basecss', function () {
    return gulp.src(paths.basecss)
        .pipe(concat('base.min.css'))
        .pipe(gulp.dest(paths.web + "styles"));
});

gulp.task('styles', function () {
    return gulp.src(paths.styles)
        .pipe(gulpif(argv.production, sass({outputStyle: 'compressed'}).on('error', sass.logError)))
        .pipe(gulpif(!argv.production, sass().on('error', sass.logError)))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(paths.web + "styles"));
});

gulp.task('partials', function () {
    return gulp.src(paths.partials)
        .pipe(gulp.dest(paths.web + "partials"));
});

gulp.task('images', function () {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.web + "images"));
});


gulp.task('build', ['libs', 'zxcvbn', 'scripts', 'basecss', 'styles', 'partials', 'images']);

gulp.task('watch', ['build'], function () {
    gulp.watch(paths.libs, ['libs']);
    gulp.watch(paths.zxcvbn, ['zxcvbn']);
    gulp.watch(paths.basecss, ['basecss']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.scrips, ['scripts']);
    gulp.watch(paths.partials, ['partials']);
    gulp.watch(paths.images, ['images']);
});