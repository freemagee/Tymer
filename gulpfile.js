"use strict";

// Inspired by https://www.mikestreety.co.uk/blog/advanced-gulp-file
// Define gulp before we start
const gulp = require("gulp");
// Define Sass, Sourcemaps
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
// POST CSS
const postcss = require("gulp-postcss");
const cssnext = require("postcss-cssnext");
const cssnano = require("cssnano");
const pxtorem = require("postcss-pxtorem");
const fontmagician = require("postcss-font-magician");
// Define other utilities
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const changed = require("gulp-changed");
const browserSync = require("browser-sync").create();
// This is an object which defines paths for the styles.
// Can add paths for javascript or images for example
// The folder, files to look for and destination are all required for sass
const paths = {
  styles: {
    src: "./build/library/scss/",
    files: "./build/library/scss/**/*.scss",
    dest: "./build/library/css/"
  },
  scripts: {
    src: "./build/library/js/*.js"
  }
};
// A display error function, to format and make custom errors more uniform
// Could be combined with gulp-util or npm colors for nicer output
const displayError = error => {
  // Initial building up of the error
  let errorString = `[${error.plugin}]`;
  errorString += ` ${error.message.replace("\n", " ")}`; // Removes new line at the end
  // If the error contains the filename or line number add it to the string
  if (error.fileName) {
    errorString += ` in ${error.fileName}`;
  }
  if (error.lineNumber) {
    errorString += ` on line ${error.lineNumber}`;
  }
  // This will output an error like the following:
  // [gulp-sass] error message in file_name on line 1
  notify(errorString).write("");
};
// A change event function, displays which file changed
const changeEvent = evt => {
  const filename = evt.path.split("\\").pop();
  notify(`[watcher] File ${filename} was ${evt.type}, compiling...`).write("");
};

// Setting up the sass task
gulp.task("compile-styles", () => {
  const plugins = [
    pxtorem({
      replace: false
    }),
    fontmagician({
      variants: {
        "Open Sans": {
          "400": [],
          "400i": [],
          "700": []
        },
        Oswald: {
          "700": []
        }
      },
      foundries: ["google"],
      display: "swap"
    }),
    cssnext({
      browsers: ["> 1%", "last 2 versions", "not ie <= 8"]
    }),
    cssnano({
      preset: "default",
      autoprefixer: false
    })
  ];
  // Taking the path from the paths object
  return (
    gulp
      .src([paths.styles.files])
      .pipe(
        plumber(function(error) {
          // If there is an error use the custom displayError function
          displayError(error);
          this.emit("end");
        })
      )
      // Only process files that have changed
      .pipe(changed(paths.styles.dest))
      .pipe(sourcemaps.init())
      // Sass
      .pipe(sass())
      // Process with PostCSS - autoprefix & minify
      .pipe(postcss(plugins))
      .pipe(sourcemaps.write("."))
      // Finally output a css file
      .pipe(gulp.dest(paths.styles.dest))
      // Inject into browser
      .pipe(
        browserSync.stream({
          match: "**/*.css"
        })
      )
  );
});

// The tasks passed in as an array are run before the tasks within the function
gulp.task("watch-styles", ["compile-styles"], () => {
  // Watch the files in the paths object, and when there is a change, fun the functions in the array
  gulp
    .watch(paths.styles.files, ["compile-styles"])
    // Also when there is a change, display what file was changed, only showing the path after the 'sass folder'
    .on("change", evt => {
      changeEvent(evt);
    });
});

// Watch js files and reload browser
// gulp.task("watch-js", () => {
//   gulp.watch([paths.scripts.src, paths.scripts.calendar]).on("change", evt => {
//     browserSync.reload();
//     notify(
//       `[watcher] File ${evt.path.replace(/.*(?=Javascript)/, "")} was ${
//         evt.type
//       }, reloading browser...`
//     ).write("");
//   });
// });

// Serve site and enable browsersync
gulp.task("serve", ["watch-styles"], () => {
  // Initiate BrowserSync
  // Docs: https://www.browsersync.io/docs/gulp
  browserSync.init({
    server: {
      baseDir: "./build"
    },
    // proxy: "http://localhost:3030"
  });
});
