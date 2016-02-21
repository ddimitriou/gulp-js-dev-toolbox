'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var minimist = require('minimist');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('gulp-jscs-stylish');
var gulpif = require('gulp-if');
var fixmyjs = require('gulp-fixmyjs');

var knownOptions = {
  string: ['source']
};

var commandLineOptions = minimist(process.argv.slice(2), knownOptions);

gulp.task('syntax', 'Check the js syntax using jshint. Default lib/ and tests/ directories are checked.', function () {
  var projectRoot = gulp.task.configuration.projectRoot;
  var sources;

  sources = ['lib/**/*.js', 'tests/**/*.js'];

  if (commandLineOptions.source) {
    sources = _.split(commandLineOptions.source, ',');
  } else if (_.has(gulp.task.configuration, 'tasks.syntax.source')) {
    sources = gulp.task.configuration.tasks['syntax'].source;
    gutil.log(gutil.colors.blue('Read source from the configuration file: ' + sources));
  }

  sources = _.map(sources, function (sourceValue) {
    return projectRoot + _.trimStart(sourceValue, '/');
  });

  return gulp.src(sources)
    .pipe(gulpif(commandLineOptions.fix, fixmyjs()))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulpif(commandLineOptions.fix, gulp.dest(function (file) {
      return file.base;
    })));
}, {
  options: {
    'source': 'The source files to check the js code syntax. To add multiple sources use a \',\'.Example gulp syntax ' +
      '--source=lib/**/*.js,tests/**/*.js',
    'fix': 'Auto fix the code syntax errors found. Exampe gulp syntax --fix'
  }
});

gulp.task('codestyle', 'Check the js codestyle using jscs. Default lib/ and tests/ directories are checked.', function () {
  var projectRoot = gulp.task.configuration.projectRoot;
  var options = {};
  var sources;

  sources = ['lib/**/*.js', 'tests/**/*.js'];

  if (commandLineOptions.source) {
    sources = _.split(commandLineOptions.source, ',');
  } else if (_.has(gulp.task.configuration, 'tasks.codestyle.source')) {
    sources = gulp.task.configuration.tasks['codestyle'].source;
    gutil.log(gutil.colors.blue('Read source from the configuration file: ' + sources));
  }

  if (commandLineOptions.fix) {
    options.fix = true;
  }

  if (_.has(gulp.task.configuration, 'tasks.codestyle.options')) {
    _.merge(options, gulp.task.configuration.tasks.codestyle.options);
    gutil.log(gutil.colors.blue('Read options from the configuration file and combine with the given arguments.'));
  }

  sources = _.map(sources, function (sourceValue) {
    return projectRoot + _.trimStart(sourceValue, '/');
  });

  return gulp.src(sources)
    .pipe(jscs(options))
    .pipe(stylish())
    .pipe(gulpif(options.fix, gulp.dest(function (file) {
      return file.base;
    })));
}, {
  options: {
    'source': 'The source files to check the js codestyle. To add multiple sources use a \',\'.Example gulp codestyle ' +
      '--source=lib/**/*.js,tests/**/*.js',
    'fix': 'Auto fix the code style errors found. Exampe gulp codestyle --fix'
  }
});

gulp.task('checkstyle', 'Check to code on styling and syntax.', ['codestyle', 'syntax']);

gulp.task('default', ['checkstyle']);
