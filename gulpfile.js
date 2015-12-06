var gulp = require('gulp'),
  typescript = require('gulp-tsc'),
  jasmine = require('gulp-jasmine');

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

gulp.task('default', ['compile'])
