// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
        'public/**/*.js',
        '!public/lib/**'
        ])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Concatenate & Minify lib JS
gulp.task('lib_scripts', function() {
    return gulp.src([
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/highlightjs/highlight.pack.js',
        'public/lib/angular/angular.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-highlightjs/angular-highlightjs.min.js'
        ])
        .pipe(concat('lib-all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('lib-all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('public/**/*.js', ['lib_scripts', 'scripts']);
});

// Default Task
gulp.task('default', ['lib_scripts', 'scripts', 'watch']);
