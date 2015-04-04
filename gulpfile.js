// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');//To prevent pipe breaking caused by errors at 'watch'

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
        'public/**/*.js',
        '!public/lib/**'
        ])
        .pipe(plumber({
            errorHandler: handleError
        }))
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Concatenate & Minify lib JS
gulp.task('lib_scripts', function() {
    return gulp.src([
        'public/lib/angular/angular.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-hotkeys/build/hotkeys.min.js',
        'public/lib/ngSmoothScroll/angular-smooth-scroll.min.js',
        'public/lib/ace-builds/src-min-noconflict/ace.js',
        'public/lib/angular-ui-ace/ui-ace.min.js'        
        ])
        .pipe(plumber({
            errorHandler: handleError
        }))
        .pipe(concat('lib-all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('lib-all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('_watch', function() {
    gulp.watch('public/**/*.js', ['lib_scripts', 'scripts']);
});

// Default Task
gulp.task('default', ['lib_scripts', 'scripts']);

// Install Task
gulp.task('install', ['default']);

// Watch task
gulp.task('watch', ['lib_scripts', 'scripts', '_watch']);


var handleError = function (err) {
  console.log(err.toString());
  this.emit('end');
};
