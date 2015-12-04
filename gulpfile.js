var del = require('del');
var gulp = require('gulp');
var typescript = require('gulp-typescript');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var KarmaServer = require('karma').Server;

var tsProject = typescript.createProject({
	declarationFiles: true,
	module: 'commonjs',
	target: 'ES5',
	emitDecoratorMetadata: true,
	experimentalDecorators: true,
	noExternalResolve: true
});

var PATHS = {
	src: {
		ts: ['!src/*.d.ts', 'src/*.ts'],
		html: 'src/*.html',
		css: 'src/*.css',
		test: 'test/*.ts',
		typings: 'src/*.d.ts'
	},
	libs: [
		'bower_components/bootstrap/dist/css/bootstrap.min.css',
		'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
		'bower_components/font-awesome/css/font-awesome.min.css',
		'node_modules/angular2/bundles/angular2.min.js',
		'node_modules/systemjs/dist/system.js',
		'node_modules/systemjs/dist/system-polyfills.js'
	],
	fonts: [
		'bower_components/font-awesome/fonts/*',
	],
	rx: 'node_modules/\@reactivex/rxjs/dist/**/*.js',
	typings: [
		'node_modules/angular2/*.d.ts',
		'node_modules/angular2/src/**/*.d.ts',
		'node_modules/angular2/manual_typings/*.d.ts',
		'node_modules/angular2/typings/**/*.d.ts',
		'node_modules/\@reactivex/rxjs/dist/cjs/**/*.d.ts'
	],
	testTypings: [
		'node_modules/angular2/*.d.ts',
		'node_modules/angular2/src/**/*.d.ts',
		'node_modules/angular2/manual_typings/*.d.ts',
		'node_modules/angular2/typings/**/*.d.ts',
		'node_modules/\@reactivex/rxjs/dist/cjs/**/*.d.ts',
		'dist/*.d.ts'
		// 'typings/jasmine/jasmine.d.ts'
	],
};

gulp.task('clean', function (done) {
	return del(['dist'], done);
});

gulp.task('ts', function () {
	var tsResult = gulp.src(PATHS.src.ts.concat(PATHS.typings))
		.pipe(sourcemaps.init())
		.pipe(typescript(tsProject));

	return merge([
		tsResult.js.pipe(sourcemaps.write()).pipe(gulp.dest('dist')),//.pipe(uglify())
		tsResult.dts.pipe(gulp.dest('src')).pipe(gulp.dest('dist'))
	]);
});

gulp.task('html', function () {
	return gulp.src(PATHS.src.html).pipe(gulp.dest('dist'));
});

gulp.task('fonts', function () {
	return gulp.src(PATHS.fonts).pipe(gulp.dest('dist/fonts'));
});

gulp.task('css', function () {
	return gulp.src(PATHS.src.css).pipe(gulp.dest('dist'));
});

gulp.task('rx', function () {
	return gulp.src(PATHS.rx, {base: 'node_modules/\@reactivex/'}).pipe(gulp.dest('dist/\@reactivex'));
});

gulp.task('libs', ['rx'], function () {
	return gulp.src(PATHS.libs).pipe(gulp.dest('dist/lib'));
});

gulp.task('build', function() {
	return gulp.start('libs', 'html', 'css', 'ts');
});

gulp.task('rebuild', ['clean'], function() {
	return gulp.start('build');
});

gulp.task('watch', ['build'], function () {
	gulp.watch(PATHS.src.ts, ['ts']);
	gulp.watch(PATHS.src.html, ['html']);
	gulp.watch(PATHS.src.css, ['css']);
});

gulp.task('default', function() {
	return gulp.start('rebuild');
});