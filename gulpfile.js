var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var outputPath = 'dist';

// Compiles SCSS files
gulp.task('sass', function() {
    return gulp.src(['src/scss/main.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outputPath + '/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src([
        'src/vendor/chart/Chart.js',
        'src/vendor/glide/glide.js',
        'src/js/dashboard.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outputPath + '/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor files from /node_modules into /vendor
// NOTE: requires `npm install` before running!
gulp.task('vendors', function() {

    gulp.src(['node_modules/bootstrap/dist/**'])
        .pipe(gulp.dest('src/vendor/bootstrap'));

    gulp.src(['node_modules/@glidejs/glide/dist/**'])
        .pipe(gulp.dest('src/vendor/glide'));

    gulp.src(['node_modules/chart.js/dist/**'])
        .pipe(gulp.dest('src/vendor/chart'));
});

// Default task
gulp.task('default', ['sass', 'vendors', 'minify-js']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            index: "index.html"
        },
    })
});

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'sass', 'minify-js'], function() {
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('dist/js/**/*.js', browserSync.reload);
    gulp.watch('dist/css/**/*.css', browserSync.reload);
});