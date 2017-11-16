var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var sourcemaps = require('gulp-sourcemaps');
var rebaseUrlPath = require('gulp-css-url-rebase');
var modifyCssUrls = require('gulp-modify-css-urls');
var concat = require('gulp-concat');
var uglifycss = require('gulp-uglifycss');

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

//主界面css
gulp.task('mincss', (cb) => {
    pump([
        gulp.src([
            './src/css/Base.css',
            './src/js/artDialog/skins/blue.css',
            './src/js/bootstrap/css/bootstrap.min.css',
            './src/js/Jcrop/css/jquery.Jcrop.css',
            './src/js/plupload/jquery.plupload.queue/css/jquery.plupload.queue.css',
            './src/js/EasyUI/themes/icon.css',
            './src/js/EasyUI/themes/default/easyui.css'
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