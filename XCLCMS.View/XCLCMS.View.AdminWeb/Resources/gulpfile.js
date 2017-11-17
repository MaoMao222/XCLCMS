var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var sourcemaps = require('gulp-sourcemaps');
var rebaseUrlPath = require('gulp-css-url-rebase');
var modifyCssUrls = require('gulp-modify-css-urls');
var concat = require('gulp-concat');
var uglifycss = require('gulp-uglifycss');

//压缩js
gulp.task('default', function (cb) {
    pump([
        gulp.src('./dist/*.js'),
        sourcemaps.init(),
        uglify(),
        sourcemaps.write('.'),
        gulp.dest('./dist/')
    ], cb);
});

//压缩css
gulp.task('mincss', (cb) => {
    pump([
        gulp.src([
            './src/js/EasyUI/themes/icon.css',
            './src/js/EasyUI/themes/default/easyui.css',
            './src/js/artDialog/skins/blue.css',
            './src/css/base.css'
        ]),
        rebaseUrlPath(),
        modifyCssUrls({
            prepend: '../'
        }),
        concat('style.css'),
        uglifycss(),
        gulp.dest('./dist/')
    ], cb);
});