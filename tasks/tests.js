'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var minimist = require('minimist');
var gutil = require('gulp-util');
var istanbul = require('gulp-istanbul');

var knownOptions = {
  string: ['test', 'source']
};

var commandLineOptions = minimist(process.argv.slice(2), knownOptions);

gulp.task('tests', 'Run the selected unit tests with mocha. Default run the tests in tests/ directoy.', function () {
  var options = {};
  var projectRoot = gulp.task.configuration.projectRoot;
  var source = projectRoot + 'tests/**/*.js';

  gutil.log(gutil.colors.blue('Running task \'tests\' in directoy: ' + projectRoot));

  if (commandLineOptions.test) {
    options.grep = commandLineOptions.test;
    gutil.log(gutil.colors.blue('Run test ' + commandLineOptions.test));
  }

  if (commandLineOptions.source) {
    source = commandLineOptions.source;
  } else if (_.has(gulp.task.configuration, 'tasks.tests.source')) {
    source = gulp.task.configuration.tasks.tests.source;
    gutil.log(gutil.colors.blue('Read source from the configuration file: ' + source));
  }

  source = projectRoot + _.trimStart(source, '/');

  if (commandLineOptions.test) {
    options.grep = commandLineOptions.test;
    gutil.log(gutil.colors.blue('Run test ' + commandLineOptions.test));
  }

  if (_.has(gulp.task.configuration, 'tasks.tests.options')) {
    _.merge(options, gulp.task.configuration.tasks.tests.options);
    gutil.log(gutil.colors.blue('Read options from the configuration file and combine with the given arguments.'));
  }

  return gulp.src(source)
    .pipe(mocha(options));
}, {
  options: {
    source: 'The file or directory to test. Example gulp tests --source=tests/**/*.js',
    test: 'Run a single test in the given test file or directory. Example gulp tests --test [testname]'
  }
});

gulp.task('tests-coverage', 'Run the unittests with code coverage using mocha and istanbul.', function () {
  var options = {};
  var sources, tests;

  sources = ['lib/**/*.js'];
  tests = ['tests/**/*.js'];

  if (commandLineOptions.source) {
    sources = _.split(commandLineOptions.source, ',');
  } else if (_.has(gulp.task.configuration, 'tasks.tests-coverage.source')) {
    sources = gulp.task.configuration.tasks['tests-coverage'].source;
    gutil.log(gutil.colors.blue('Read source from the configuration file: ' + sources));
  }

  if (commandLineOptions.tests) {
    tests = _.split(commandLineOptions.tests, ',');
  } else if (_.has(gulp.task.configuration, 'tasks.tests-coverage.tests')) {
    tests = gulp.task.configuration.tasks['tests-coverage'].tests;
    gutil.log(gutil.colors.blue('Read tests from the configuration file: ' + tests));
  }

  if (_.has(gulp.task.configuration, 'tasks.tests-coverage.options')) {
    _.merge(options, gulp.task.configuration.tasks['tests-coverage'].options);
    gutil.log(gutil.colors.blue('Read options from the configuration file and combine with the given arguments.'));
  }

  return gulp.src(sources)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .pipe(gulp.src(tests))
    .pipe(mocha(options))
    .pipe(istanbul.writeReports());
}, {
  options: {
    source: 'The directory to sources files are located. Example gulp tests-coverage --source=lib/**/*.js',
    tests: 'The directory to test are located. Example gulp tests-coverage --tests=tests/**/*.js'
  }
});

gulp.task('watch-tests', 'Watch for file changes and execute the tests task. Default the tests/ directory will be watched.', function () {
  var projectRoot = gulp.task.configuration.projectRoot;
  var source = projectRoot + 'tests/**/*.js';

  if (commandLineOptions.source) {
    source = commandLineOptions.source;
  } else if (_.has(gulp.task.configuration, 'tasks.watch-tests.source')) {
    source = gulp.task.configuration.tasks['watch-tests'].source;
    gutil.log(gutil.colors.blue('Read source from the configuration file: ' + source));
  }

  source = projectRoot + _.trimStart(source, '/');

  gutil.log(gutil.colors.blue('Watch directory ' + source + ' for changes and run the tests on.'));
  gulp.watch(source, ['tests']);
}, {
  options: {
    test: 'The test to run when a file is changed. Example gulp watch-tests --test "Some unit test"',
    source: 'The directory to watch for file changes. Default the tests directory will be watched. Example gulp watch-tests ' +
      '--source=tests/**/*.js'
  }
});

gulp.task('default', ['tests']);
