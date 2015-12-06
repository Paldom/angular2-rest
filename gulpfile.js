var gulp = require('gulp'),
  typescript = require('gulp-tsc'),
  jasmine = require('gulp-jasmine'),
  typedoc = require("gulp-typedoc");

gulp.task('compile', function () {
  gulp.src(['./*.ts'])
    .pipe(typescript({
      "target": "es5",
      "noImplicitAny": false,
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
    }))
    .pipe(gulp.dest('.'));
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

gulp.task('default', ['compile', 'typedoc'])
