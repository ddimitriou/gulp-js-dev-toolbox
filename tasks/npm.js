'use strict';

var gulp = require('gulp');
var install = require('gulp-install');
var minimist = require('minimist');
var del = require('del');
var gutil = require('gulp-util');
var prompt = require('gulp-prompt');
var shell = require('gulp-shell');
var git = require('gulp-git');

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

gulp.task('bump', 'Bump package version and push to origin.', function () {
  return gulp.src('', {
      read: false
    })
    .pipe(prompt.prompt({
      type: 'list',
      name: 'bump',
      message: 'What type of bump would you like to do?',
      choices: ['patch', 'minor', 'major']
    }, function (result) {
      return gulp.src('')
        .pipe(shell(['npm version ' + result.bump]), function() {
          git.push('origin', 'master');
        });
    }));
});

gulp.task('npm', ['npm-install']);

gulp.task('default', ['npm']);
