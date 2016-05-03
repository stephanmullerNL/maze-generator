// Require
var gulp         = require( 'gulp' );
var babel        = require('gulp-babel');

// Require - Browser Sync
var sync         = require( 'browser-sync' );
var reload       = sync.reload;

// Require - JS
var browserify   = require( 'browserify' );
var source       = require( 'vinyl-source-stream' );
var buffer       = require( 'vinyl-buffer' );
var uglify       = require( 'gulp-uglify' );
var hint         = require( 'gulp-jshint' );
var stylish      = require( 'jshint-stylish' );

// Require - Versioning
var header       = require( 'gulp-header' );
var pkg          = require( './package.json' );
var banner       = ['/** <%= pkg.name %> - <%= pkg.version %> **/\n'];

// Require - Utilites
var rename       = require( 'gulp-rename' );
var util         = require( 'gulp-util' );
var chalk        = require( 'chalk' );

var js = {
    src:  'src/js/',
    main: 'main.js',
    dist: 'dist/'
};

var css = {
    src: 'src/css/',
    main: 'style.css',
    dist: 'dist/'
};

// Log
var log = function ( err ) {
    util.log( chalk.red( 'ERROR:' ), chalk.gray ( err.message ) );
    this.emit( 'end' );
};

// Task - Browser Sync
gulp.task( 'sync' , function () {

    return sync.init( {
        server: {
            baseDir: './'
        },
        notify: false,
        logConnections: true
    } );

});

// Task - JS Development
gulp.task( 'js-dev', function () {

    gulp.src( js.src + '**/*.js' )
        .pipe( hint( '.jshintrc' ) )
        .pipe( hint.reporter( stylish ) );

    return browserify( js.src + js.main )
        .bundle()
        .on( 'error', log )
        .pipe( source( js.main ) )
        .pipe( buffer() )
        .pipe( gulp.dest( js.dist ) )
        .pipe( reload( { stream: true } ) );

} );

// Task - JS Production
gulp.task( 'js-prod', function () {

    return browserify( js.src + js.main )

        .bundle()
        .on( 'error', log )
        .pipe( source( js.main ) )
        .pipe( buffer() )
        .pipe( babel() )
        .pipe( uglify() )
        .on( 'error', log )
        .pipe( header( banner, { pkg : pkg } ) )
        .on( 'error', log )
        .pipe( rename( { suffix: '.min' } ) )
        .on( 'error', log )
        .pipe( gulp.dest( js.dist ) );

} );

gulp.task('css', function () {

    gulp.src(css.src + css.main)
        .pipe(gulp.dest(css.dist));
});

// Task - Devolopment
gulp.task( 'dev', [ 'js-dev' ] );

// Task - Production
gulp.task( 'prod', [ 'js-prod' ] );

// Task - Watch
gulp.task( 'watch', [ 'sync' ], function () {

    gulp.watch( js.src + '**/*.js', [ 'js-dev' ] );
    gulp.watch( css.src + '**/*.css', [ 'css' ] );
    gulp.watch( '**/*.php' ).on( 'change', function ( file ) {
        return gulp.src( file.path )
            .pipe( reload( { stream: true } ) );
    } );
    gulp.watch( '**/*.html' ).on( 'change', function ( file ) {
        return gulp.src( file.path )
            .pipe( reload( { stream: true } ) );
    } );
} );

// Task - Default
gulp.task( 'default', ['watch']);