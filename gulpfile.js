// Inspired by https://www.mikestreety.co.uk/blog/advanced-gulp-file
// Define gulp before we start
var gulp = require('gulp');
// Define Sass, Sourcemaps
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
// POST CSS
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
// Define other utilities
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var changed = require('gulp-changed');
var cssnano = require('cssnano');
var browserSync = require('browser-sync').create();
// This is an object which defines paths for the styles.
// Can add paths for javascript or images for example
// The folder, files to look for and destination are all required for sass
var basePaths = {
    src: './src/',
    dest: './build/'
}
var paths = {
    styles: {
        src: basePaths.src + 'library/scss',
        files: basePaths.src + 'library/scss/**/*.scss',
        dest: basePaths.dest + 'library/css'
    }
}
// A display error function, to format and make custom errors more uniform
// Could be combined with gulp-util or npm colors for nicer output
var displayError = function(error) {
    // Initial building up of the error
    var errorString = '[' + error.plugin + ']';
    errorString += ' ' + error.message.replace("\n",' '); // Removes new line at the end
    // If the error contains the filename or line number add it to the string
    if(error.fileName) {
        errorString += ' in ' + error.fileName;
    }
    if(error.lineNumber) {
        errorString += ' on line ' + error.lineNumber;
    }
    // This will output an error like the following:
    // [gulp-sass] error message in file_name on line 1
    notify(errorString).write('');
};
// A change event function, displays which file changed
var changeEvent = function(evt) {
    var filename = evt.path.split("\\").pop();
    notify('[watcher] File ' + filename + ' was ' + evt.type + ', compiling...').write('');
};
// Setting up the sass task
gulp.task('compile-styles', function () {
    var nanoOptions = {
            zindex: false
        },
        processors = [
            cssnext(),
            cssnano(nanoOptions)
        ];
    // Taking the path from the paths object
    return gulp.src(paths.styles.files)
        .pipe(plumber(function(error) {
            // If there is an error use the custom displayError function
            displayError(error);
            this.emit('end');
        }))
        // Only process files that have changed
        .pipe(changed(paths.styles.dest))
        .pipe(sourcemaps.init())
        // Sass
        .pipe(sass())
        // Process with PostCSS - autoprefix & minify
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        // Finally output a css file
        .pipe(gulp.dest(paths.styles.dest))
        // Inject into browser
        .pipe(browserSync.stream({
            match: '**/*.css'
        }));
});
// Watch js files and reload browser
gulp.task('watch-sass', ['compile-styles'], function() {
    // Watch the files in the paths object, and when there is a change, fun the functions in the array
    gulp.watch(paths.styles.files, ['compile-styles'])
    // Also when there is a change, display what file was changed, only showing the path after the 'sass folder'
    .on('change', function(evt) {
        changeEvent(evt);
    });
});
// Serve site and enable browsersync
gulp.task('serve', ['watch-sass'], function () {
    // Initiate BrowserSync
    // Docs: https://www.browsersync.io/docs/gulp
    browserSync.init({
        proxy: "http://localhost:3030/"
    });
});