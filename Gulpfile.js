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
    gitbook         = require('gitbook');

//base paths
const src_base_url = 'src';
const dest_base_url = 'www';

// the source paths
const source_paths = {
  scripts:      src_base_url + '/js/index.js',
  scss:         src_base_url + '/scss/app.scss',
  fonts:        src_base_url + '/fonts/**/*',
  images:       src_base_url + '/imgs/**/*.*',
  index_page:   src_base_url + '/index.html',
};

// the source paths
const dest_paths = {
  scripts:      dest_base_url + '/js/',
  css:          dest_base_url + '/css/',
  fonts:        dest_base_url + '/fonts/',
  images:       dest_base_url + '/imgs/',
  index_page:   dest_base_url ,
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
    .pipe(gulp.dest(dest_paths.scripts));
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
    .pipe(gcmq().on('error', onError))
    .pipe(rename({ extname: '.min.css' }).on('error', onError))
    .pipe(sourcemaps.write('./map').on('error', onError))
    .pipe(gulp.dest(dest_paths.css).on('error', onError))
    .pipe(notify("scss compiled/minifyed/auoprefixed : <%= file.relative %>!"))
});

/*------ html bundler ------*/

gulp.task('index:build', function() {
  return gulp.src(source_paths.index_page)
    .pipe(gulp.dest(dest_paths.index_page));
});

/*------ all bundle ------*/

gulp.task('build:all', [
    'js:build',
    'css:build',
    'index:build'
]);

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
