'use strict';

var gulp = require('gulp-help')(require('gulp'));
var requireDir = require('require-dir');

requireDir('./tasks');

var configuration = {};

try {
  configuration = require('./dev-toolbox.config.json');
}
catch (error) {
}

gulp.task.configuration = configuration;

if (!configuration.projectRoot) {
  configuration.projectRoot = './';
}

configuration.projectRoot = gulp.task.configuration.projectRoot.trim('/');

gulp.task('pre-commit', 'Run codestyling and tests before you create your commit.', ['clear-debug'], function () {
  gulp.start('pre-commit:checkstyle');
});

gulp.task('pre-commit:checkstyle', false, ['checkstyle'], function () {
  gulp.start('tests');
});
gulp.task('default', ['checkstyle', 'tests']);
