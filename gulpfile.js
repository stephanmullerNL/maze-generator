var gulp = require('gulp');

var babel      = require('babelify'),
    browserify = require('browserify'),
    buffer     = require('vinyl-buffer'),
    connect    = require('gulp-connect'),
    del        = require('del'),
    jshint     = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
    source     = require('vinyl-source-stream'),
    uglify     = require('gulp-uglify'),
    watchify   = require('watchify');

var config = {
    dest: "./dist/",
    scripts: {
        all: "src/**/*.js",
        main: "src/js/main.js",
        options: {
            mangle: false
        },
        out: "maze.js"
    },
    server: {
        root: '',
        port: 1337
    }
};

function compile(watch) {
    var bundler = watchify(
                    browserify(config.scripts.main, { debug: true })
                    .transform(babel, { presets: ["es2015"] })
                );

    function rebundle() {
        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end'); })
            .pipe(source(config.scripts.out))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.dest));
    }

    if (watch) {
        bundler.on('update', function() {
            console.log('-> bundling...');
            rebundle();
        });
    }

    rebundle();
}


gulp.task('clean', function() {
    del(config.dest + "/**/*");
});

gulp.task('connect', function() {
    connect.server(config.server);
});

gulp.task('hint', function() {
    gulp.src(config.scripts.all)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build', function() {
    return compile();
});

gulp.task('scripts', function () {
    return compile(true);
});

gulp.task('watch', function() {
    gulp.watch(config.scripts.all, ['hint', 'scripts']);
});

//gulp.task('default', ['watch']);
gulp.task('default', ['clean', 'hint', 'watch', 'connect']);