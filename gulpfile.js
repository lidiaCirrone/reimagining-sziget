/*global require*/
"use strict";

var gulp = require('gulp'),
    path = require('path'),
    data = require('gulp-data'),
    twig = require('gulp-twig'),
    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass')(require('sass')),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    fs = require('fs');
    
/*
 * Directories here
 */

var paths = {
   public: './public/',
   sass: './src/scss/',
   css: './public/assets/css/',
   data: './src/data/'
};

/**
* Compile .twig files and pass data from json file
* matching file name. index.twig - index.twig.json into HTMLs
*/

gulp.task('twig', function () {
   return gulp.src(['./src/templates/*.twig'])
   // Stay live and reload on error
   .pipe(plumber({
      handleError: function (err) {
         console.log(err);
         this.emit('end');
      }
   }))
   .pipe(data(function (file) {
      return JSON.parse(fs.readFileSync(paths.data +
path.basename(file.path) + '.json'));
   }))
   .pipe(twig())
   .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
   })
   .pipe(gulp.dest(paths.public));
});

/**
 * Recompile .twig files and live reload the browser
 */

gulp.task('rebuild', ['twig'], function () {
   // BrowserSync Reload
   browserSync.reload();
});

/**
 * Wait for twig, js and sass tasks, then launch the browser-sync Server
 */

gulp.task('browser-sync', ['sass', 'twig', 'js'], function () {
browserSync({
   server: {
      baseDir: paths.public
   },
   notify: false,
   browser:"google chrome"
   });
});

/**
 * Compile .scss files into build css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */

gulp.task('sass', function () {
return gulp.src(paths.sass + 'vendors/main.scss')      
   .pipe(sourcemaps.init())
   // Stay live and reload on error
   .pipe(plumber({
      handleError: function (err) {
         console.log(err);
         this.emit('end');
      }
   }))   
   .pipe(
      sass({
          includePaths: [paths.sass + 'vendors/'],
          outputStyle: 'expanded'
      }).on('error', function (err) {
          console.log(err.message);
          this.emit('end');
      })
   )
   .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
   }))
   .pipe(sourcemaps.write('.'))
   .pipe(gulp.dest(paths.css));
});

/**
 * Compile .js files into build js directory With app.min.js
 */

gulp.task('js', function(){
   return gulp.src(paths.public + 'assets/js/script.js')
      .pipe(sourcemaps.init())
      .pipe(concat('script.min.js'))
      .on('error', function (err) {
         console.log(err.toString());
         this.emit('end');
      })      
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.public + 'assets/js'));
   });

/**
 * Watch scss files for changes & recompile
 * Watch .twig files run twig-rebuild then reload BrowserSync
 */

gulp.task('watch', function () {
   gulp.watch(paths.public + 'assets/js/script.js', ['js', browserSync.reload]);
   gulp.watch(paths.sass + 'vendors/main.scss', ['sass', browserSync.reload]);
   gulp.watch([
       'src/templates/**/*.twig',
       'src/data/**/*.twig.json'
     ], 
     {cwd:'./'}, 
     ['rebuild']);
});

// Build task compile sass and twig.

gulp.task('build', ['sass', 'twig']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the project site, launch BrowserSync then watch
 * files for changes
 */

gulp.task('default', ['browser-sync', 'watch']);