var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('default', function (cb) {
    pump([
        gulp.src('./dist/*.js'),
        sourcemaps.init(),
        uglify(),
        sourcemaps.write('.'),
        gulp.dest('./dist/')
    ],
        cb
    );
});