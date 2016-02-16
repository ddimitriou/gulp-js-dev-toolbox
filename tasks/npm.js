'use strict';

var gulp = require('gulp');
var install = require('gulp-install');
var minimist = require('minimist');
var del = require('del');
var gutil = require('gulp-util');

var knownOptions = {
  boolean: ['force']
};

var commandLineOptions = minimist(process.argv.slice(2), knownOptions);

gulp.task('npm-install', 'Install all the required dependencies.', function () {
  if (commandLineOptions.force) {
    del(['node_modules/']);
    gutil.log(gutil.colors.blue('Forced install triggerd, removing the node_modules diretory.'));
  }

  return gulp.src(['./package.json'])
    .pipe(install());
}, {
  options: {
    'force': 'Clears the node_modules directory before install the packages. For example gulp npm-install --force'
  }
});

gulp.task('npm-clear', 'Remove the node_modules directory.', function () {
  gutil.log(gutil.colors.blue('This will remove the node_modules direcory. Gulp can not be used anymore, run npm install first.'));

  return del(['node_modules/']);
});

gulp.task('npm', ['npm-install']);

gulp.task('default', ['npm']);
