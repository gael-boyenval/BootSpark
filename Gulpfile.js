'use strict';
// dependencies
var gulp            = require('gulp'),
    rollup          = require('gulp-rollup'),
    sourcemaps      = require('gulp-sourcemaps'),
    changed         = require('gulp-changed'),
    sass            = require('gulp-sass'),
    notify          = require('gulp-notify'),
    autoprefixer    = require('gulp-autoprefixer'),
    minifyCss       = require('gulp-minify-css'),
    gcmq            = require('gulp-group-css-media-queries'),
    rename          = require('gulp-rename'),
    babel           = require('rollup-plugin-babel'),
    markdownpdf     = require('gulp-markdown-pdf'),
    concat          = require('gulp-concat'),
    gitbook         = require('gitbook'),
    nunjucksRender  = require('gulp-nunjucks-render'),
    connect         = require('gulp-connect');

//base paths
const src_base_url = 'src';
const dest_base_url = 'www';

// the source paths
const source_paths = {
    scripts:      src_base_url + '/assets/js/index.js',
    scss:         src_base_url + '/assets/scss/app.scss',
    fonts:        src_base_url + '/assets/fonts/**/*',
    images:       src_base_url + '/assets/imgs/**/*.*',
};

// the source paths
const dest_paths = {
    scripts:      dest_base_url + '/js/',
    css:          dest_base_url + '/css/',
    fonts:        dest_base_url + '/fonts/',
    images:       dest_base_url + '/imgs/',
};

/*------ Hanlde errors ------*/

function onError(err) {
    console.log(err);
    notify("error: "+ err);
    this.emit('end');
}

/*------------------------------------------------*\
                BUILD TASKS
\*------------------------------------------------*/

/*------ ES2015 JS bundler ------*/

gulp.task('js:build', function(){
    gulp.src( source_paths.scripts, {read: false})
        .pipe(rollup({
            sourceMap: true,
            plugins: [
                babel()
            ]
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(dest_paths.scripts))
        .pipe(connect.reload());
});

/*------ SCSS bundler ------*/

gulp.task('css:build', function() {
    return gulp.src(source_paths.scss)
        .pipe(sourcemaps.init().on('error', onError))
        .pipe(changed(dest_paths.css).on('error', onError))
        .pipe(sass().on('error', onError))
        .pipe(gulp.dest(dest_paths.css))
        .pipe(autoprefixer({browsers: ['> 1%','last 2 versions','ie > 8'],cascade:false}).on('error', onError))
        .pipe(minifyCss({keepSpecialComments: 0}).on('error', onError))
        //.pipe(gcmq().on('error', onError))
        .pipe(rename({ extname: '.min.css' }).on('error', onError))
        .pipe(sourcemaps.write('./map').on('error', onError))
        .pipe(gulp.dest(dest_paths.css).on('error', onError))
        .pipe(notify("scss compiled/minifyed/auoprefixed : <%= file.relative %>!"))
        .pipe(connect.reload());
});

/*------ html builder ------*/

gulp.task('html:build', function() {
    return gulp.src(src_base_url + '/pages/**/*.+(html|nunjucks)')
        .pipe(nunjucksRender({
            path: [src_base_url + '/templates']
        }).on('error', onError))
        .pipe(gulp.dest(dest_base_url + '/pages'))
        .pipe(notify("html builded : <%= file.relative %>!"))
        .pipe(connect.reload());
});

/*------ all bundle ------*/

gulp.task('build', [
    'js:build',
    'css:build',
    'html:build'
]);

/*------------------------------------------------*\
                   WATCHERS
\*------------------------------------------------*/

gulp.task('css:watch', function(){
    return gulp.watch(src_base_url + '/assets/scss/**/*.scss', ['css:build']);
});

gulp.task('js:watch', function(){
    return gulp.watch(src_base_url + '/assets/js/**/*.js', ['js:build']);
});

gulp.task('html:watch', function(){
    return gulp.watch(src_base_url + '/pages/**/*.+(html|nunjucks)', ['html:build']);
});

gulp.task('watch', [
    'css:watch',
    'js:watch',
    'html:watch'
]);

/*------------------------------------------------*\
                  DEV SERVER
\*------------------------------------------------*/

gulp.task('connect', function() {
    connect.server({
        root: dest_base_url,
        livereload: true,
        directoryListing: true
    });
});

/*------------------------------------------------*\
                DOCUMENTATION
\*------------------------------------------------*/

const src_doc_url = './src/doc';
const dest_doc_url = './doc';

gulp.task('doc:build', function (cb) {
    var book = new gitbook.Book(src_doc_url+'/', {
        "config": {
            "output": dest_doc_url+"/"
        }
    });
    book.parse().then(function(){
        return book.generate("website");
    }).then(function(){
        cb();
    });
});

gulp.task('default', [ 'connect', 'build' , 'watch']);
