'use strict';

var browserify = require('browserify'),
	buffer = require('vinyl-buffer'),
	connect = require('gulp-connect'),
	deploy = require('gulp-gh-pages'),
	gif = require('gulp-if'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	jscs = require('gulp-jscs'),
	jshint = require('gulp-jshint'),
	merge = require('merge-stream'),
	minimist = require('minimist'),
	mocha = require('gulp-mocha'),
	sass = require('gulp-sass'),
	source = require('vinyl-source-stream'),
	sourcemaps = require('gulp-sourcemaps'),
	stylish = require('jshint-stylish'),
	prefix = require('gulp-autoprefixer'),
	watchify = require('watchify'),
	xtend = require('xtend');

var paths = require('./package.json').paths;

require('babel/register');

var watching = false;
gulp.task('enable-watch-mode', function () {watching = true;});

gulp.task('css', function () {
	var streams = merge();
	paths.css.forEach(function (path) {
		streams.add(gulp.src(path.src + '*.scss')
			.pipe(gif(gutil.env.sourcemaps, sourcemaps.init()))
			.pipe(sass())
			.pipe(prefix({cascade: true}))
			.pipe(gif(gutil.env.sourcemaps, sourcemaps.write('./')))
			.pipe(gulp.dest(path.dest)));
	});
	return streams;
});

gulp.task('js', function () {
	var opts = {
		entries: './' + paths.js.src + 'app.js', // browserify requires relative path
		debug: gutil.env.sourcemaps
	};
	if (watching) {
		opts = xtend(opts, watchify.args);
	}
	var bundler = browserify(opts);
	if (watching) {
		bundler = watchify(bundler);
	}
	// optionally transform
	// bundler.transform('transformer');

	bundler.on('update', function (ids) {
		gutil.log('File(s) changed: ' + gutil.colors.cyan(ids));
		gutil.log('Rebundling...');
		rebundle();
	});

	bundler.on('log', gutil.log);

	function rebundle () {
		return bundler.bundle()
			.on('error', function (e) {
				gutil.log('Browserify Error', gutil.colors.red(e));
			})
			.pipe(source('app.js'))
			// sourcemaps
				.pipe(buffer())
				.pipe(sourcemaps.init({loadMaps: true}))
				.pipe(sourcemaps.write('./'))
			//
			.pipe(gulp.dest(paths.js.dest));
	}
	return rebundle();
});

gulp.task('jscs', function () {
	return gulp.src('**/*.js')
		.pipe(jscs());
});

gulp.task('jshint', function () {
	return gulp.src('./app_storefront_richUI/cartridge/js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('test:application', function () {
	var opts = minimist(process.argv.slice(2));
	// default option to all
	var suite = opts.suite || '*';
	if (suite === 'all') {
		suite = '*';
	}
	// default reporter to spec
	var reporter = opts.reporter || 'spec';
	// default timeout to 10s
	var timeout = opts.timeout || 10000;
	return gulp.src(['test/application/' + suite + '/**/*.js', '!test/application/webdriver/*'], {read: false})
		.pipe(mocha({
			reporter: reporter,
			timeout: timeout
		}));
});

gulp.task('test:unit', function () {
	var opts = minimist(process.argv.slice(2));
	var reporter = opts.reporter || 'spec';
	var timeout = opts.timeout || 10000;
	var suite = opts.suite || '*';
	return gulp.src(['test/unit/' + suite + '/**/*.js'], {read: false})
		.pipe(mocha({
			reporter: reporter,
			timeout: timeout
		}));
});

gulp.task('default', ['enable-watch-mode', 'js', 'css'], function () {
	gulp.watch(paths.css.map(function (path) {
		return path.src + '**/*.scss';
	}), ['css']);
});

var hbsfy = require('hbsfy');
var styleguideWatching = false;
gulp.task('styleguide-watching', function () {styleguideWatching = true;});
gulp.task('js:styleguide', function () {
	var opts = {
		entries: ['./styleguide/js/main.js'],
		debug: (gutil.env.sourcemaps)
	};
	if (styleguideWatching) {
		opts = xtend(opts, watchify.args);
	}
	var bundler = browserify(opts);
	if (styleguideWatching) {
		bundler = watchify(bundler);
	}

	// transforms
	bundler.transform(hbsfy);

	bundler.on('update', function (ids) {
		gutil.log('File(s) changed: ' + gutil.colors.cyan(ids));
		gutil.log('Rebundling...');
		bundle();
	});

	var bundle = function () {
		return bundler
			.bundle()
			.on('error', function (e) {
				gutil.log('Browserify Error', gutil.colors.red(e));
			})
			.pipe(source('main.js'))
			.pipe(gulp.dest('./styleguide/dist'));
	};
	return bundle();
});

gulp.task('connect:styleguide', function () {
	var opts = minimist(process.argv.slice(2));
	var port = opts.port || 8000;
	return connect.server({
		root: 'styleguide',
		port: port
	});
});

gulp.task('css:styleguide', function () {
	return gulp.src('styleguide/scss/*.scss')
		.pipe(sass())
		.pipe(prefix({cascade: true}))
		.pipe(gulp.dest('styleguide/dist'));
});

gulp.task('styleguide', ['styleguide-watching', 'js:styleguide', 'css:styleguide', 'connect:styleguide'], function () {
	var styles = paths.css.map(function (path) {
		return path.src + '**/*.scss';
	});
	styles.push('styleguide/scss/*.scss');
	gulp.watch(styles, ['css:styleguide']);
});

// deploy to github pages
gulp.task('deploy:styleguide', ['js:styleguide', 'css:styleguide'], function () {
	var options = xtend({cacheDir: 'styleguide/.tmp'}, require('./styleguide/deploy.json').options);
	return gulp.src(['styleguide/index.html', 'styleguide/dist/**/*', 'styleguide/lib/**/*'], {base: 'styleguide'})
		.pipe(deploy(options));
});
