'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var minimist = require('minimist');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('gulp-jscs-stylish');
var shell = require('gulp-shell');

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
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
}, {
  options: {
    'source': 'The source files to check the js code syntax. To add multiple sources use a \',\'.Example gulp syntax ' +
      '--source=lib/**/*.js,tests/**/*.js'
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

  if (_.has(gulp.task.configuration, 'tasks.codestyle.options')) {
    _.merge(options, gulp.task.configuration.tasks.codestyle.options);
    gutil.log(gutil.colors.blue('Read options from the configuration file and combine with the given arguments.'));
  }

  sources = _.map(sources, function (sourceValue) {
    return projectRoot + _.trimStart(sourceValue, '/');
  });

  return gulp.src(sources)
    .pipe(jscs({ fix: true }))
    .pipe(stylish());
}, {
  options: {
    'source': 'The source files to check the js codestyle. To add multiple sources use a \',\'.Example gulp codestyle ' +
      '--source=lib/**/*.js,tests/**/*.js'
  }
});

gulp.task('style-fix', 'Auto fix the js code styling using jscs.', function () {
  var projectRoot = gulp.task.configuration.projectRoot;
  var options = {};
  var sources;

  sources = ['lib/', 'tests/'];

  if (commandLineOptions.source) {
    sources = _.split(commandLineOptions.source, ',');
  } else if (_.has(gulp.task.configuration, 'tasks.style-fix.source')) {
    sources = gulp.task.configuration.tasks['style-fix'].source;
    gutil.log(gutil.colors.blue('Read source from the configuration file: ' + sources));
  }

  if (_.has(gulp.task.configuration, 'tasks.style-fix.options')) {
    _.merge(options, gulp.task.configuration.tasks['style-fix'].options);
    gutil.log(gutil.colors.blue('Read options from the configuration file and combine with the given arguments.'));
  }

  sources = _.map(sources, function (sourceValue) {
    return projectRoot + _.trimStart(sourceValue, '/');
  });

  return gulp.src('', { read: false })
      .pipe(shell([
        [' node_modules/.bin/jscs ' + _.join(sources, ' ') + ' --fix']
      ]));
}, {
  options: {
    'source': 'The source files to check and auto fix the codestyle. To add multiple sources use a \',\'.Example gulp style-fix ' +
      '--source=lib,tests/'
  }
});

gulp.task('checkstyle', 'Check to code on styling and syntax.', ['codestyle', 'syntax']);

gulp.task('default', ['checkstyle']);
