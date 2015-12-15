var gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  jasmine = require('gulp-jasmine'),
  tsc = require('gulp-tsc'),
  typescript = require('gulp-typescript'),
  typedoc = require("gulp-typedoc");
  
var objectMerge = require('object-merge');

var tsProject = typescript.createProject('./tsconfig.json');
var tsConfig = require('./tsconfig.json');
var tsCompileDev = tsConfig.compilerOptions || {};
var tsCompileProd = objectMerge(tsCompileDev, {
  "removeComments": true,
  "declaration": false,
  "sourceMap": false
});

gulp.task('build.js.dev', function () {
  gulp.src(['./*.ts'])
    .pipe(tsc(tsCompileDev))
    .pipe(gulp.dest('.'));
});

gulp.task('build.js.prod', function () {
  gulp.src(['./*.ts'])
    .pipe(sourcemaps.init())
    .pipe(tsc(tsCompileProd))
    .pipe(uglify())
    .pipe(rename({extname: ".min.js"}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('test', function () {
  return gulp.src('spec/test.js')
    .pipe(jasmine());
});

gulp.task("typedoc", function () {
  return gulp
    .src(['./*.ts'])
    .pipe(typedoc({
      module: "commonjs",
      target: "es5",
      out: "docs/",
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      name: "angular2-rest"
    }))
    ;
});

gulp.task('default', ['build.js.dev', 'typedoc'])
