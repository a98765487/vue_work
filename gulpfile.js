
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');
const autoprefixer = require('autoprefixer');

// production || development
// # gulp --env production
const envOptions = {
    string: 'env',
    default: { env: 'development' }
};
const options = minimist(process.argv.slice(2), envOptions);

gulp.task('sass', function () {
    // PostCSS AutoPrefixer
    var processors = [
        autoprefixer({
            browsers: ['last 5 version'],
        })
    ];

    return gulp.src(['./assets/scss/**/*.sass', './assets/scss/**/*.scss'])
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'nested',
            includePaths: ['./node_modules/bootstrap/scss']
        })
            .on('error', $.sass.logError))
        .pipe($.postcss(processors))
        .pipe($.if(options.env === 'production', $.minifyCss()))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/stylesheets'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('imageMin', function () {
    gulp.src('./source/images/*')
        .pipe($.if(options.env === 'production', $.imagemin()))
        .pipe(gulp.dest('./public/images'));
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: { baseDir: './public' },
        reloadDebounce: 2000
    })
});

gulp.task('watch', function () {
    gulp.watch(['./source/stylesheets/**/*.sass', './source/stylesheets/**/*.scss'], ['sass']);
    gulp.watch(['./source/**/*.jade'], ['jade']);
    gulp.watch(['./source/javascripts/**/*.js'], ['babel']);
});
gulp.task('default', ['sass','browserSync', 'imageMin', 'watch']);
