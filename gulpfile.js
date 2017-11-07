"use strict";

var gulp = require("gulp");
var  rename = require("gulp-rename");
var  plumber = require("gulp-plumber");
var  sass = require("gulp-sass");
var  minify = require("gulp-csso");
var  postcss = require("gulp-postcss");
var  autoprefixer = require("autoprefixer");
var  mqpacker = require("css-mqpacker");
var  svgstore = require("gulp-svgstore");
var  svgmin = require("gulp-svgmin");
var  imagemin = require("gulp-imagemin");
var  server = require("browser-sync");
var  run = require("run-sequence");
var del = require("del");
var sourcemaps = require("gulp-sourcemaps");

    gulp.task("style", function() {
      gulp.src("src/sass/style.scss") 
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([
          autoprefixer({browsers: [
            "last 1 version",
            "last 2 Chrome versions",
            "last 2 Firefox versions",
            "last 2 Opera versions",
            "last 2 Edge versions"
          ]}),
          mqpacker({
            sort: false
          })
        ]))
        .pipe(gulp.dest("build/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/css"));
    });

    gulp.task("serve", function() {
      server.init({
        server: "build"
      });

      gulp.watch("src/sass/**/*.scss", ["style"]);
      gulp.watch("src/*.html")
        .on("change", server-reload);
    });

    gulp.task("images", function() {
      return gulp.src("build/img/**/*.{png,jpg,gif}")
        .pipe(imagemin([
          imagemin.optipng({optimizationLevel: 3}),
          imagemin.jpegtran({progressive: true})
        ]))
        .pipe(gulp.dest("build/img"));
    });

    gulp.task("symbols", function() {
      return gulp.src("build/img/icons/*.svg")
      .pipe(svgmin())
      .pipe(svgstore({
        inLineSvg: true
      }))
      .pipe(rename("symbols.svg"))
      .pipe(gulp.dest("build/img"));
    });

    gulp.task("build", function(fn) {
      run("style", "images", "symbols", fn);
    });

    gulp.task("copy", function() {
      return gulp.src([
        "fonts/**/*.{woff,woff2}",
        "img/**",
        "js/**",
        "*.html"
      ], {
        base: "."
      })
      .pipe(gulp.dest("build"));
    });

    gulp.task("clean", function() {
      return del("build");
    });

    gulp.task("build", function(fn) {
      run(
        "clean",
        "copy",
        "style",
        "images",
        "symbols",
        fn
      );
    });