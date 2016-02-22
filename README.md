gulp-js-dev-toolbox
--
There are a lot of tools available all with different settings and command line arguments. It makes live a lot easier if all these tasks can be done automatically when code changes in a file or before a commit is done. This toolbox contains automated tasks that install dependencies, checks code styling, structure and running unit tests with or without code coverage.

The toolbox uses [gulp](http://gulpjs.com/) as the task runner. Gulp is using [nodejs](https://nodejs.org/en/) as a engine. This way gulp has the ability to run tasks async which will increase the speed off your tasks. If you really need to run the task in sync it's still possible. See the [gulp api documentation](https://github.com/gulpjs/gulp/blob/master/docs/API.md) for more information. Tasks in gulp are created by code and not by configuration. This makes it a lot easier to read and all the tools that are available for [nodejs](https://nodejs.org/en/) are at your disposal for creating tasks.

# Requirements
To make use of this toolbox [nodejs](https://nodejs.org/en/) and gulp are required. Gulp will be installed by the toolbox itself. Nodejs can be [downloaded](https://nodejs.org/en/download/) or installed using a [package manager](https://nodejs.org/en/download/package-manager/).

# Setup
The js tools can be added as a dev dependency in your package.json of your project.
```bash
npm install --save-dev gulp-js-dev-toolbox
```

# Available tasks
To see all the available tasks
```bash
gulp help
```

The task are using gulp plugins to call various javascript tools like [mocha](http://mochajs.org/), [istanbul](https://github.com/gotwarlost/istanbul), [npm](https://www.npmjs.com/), [jshint](https://github.com/jshint/jshint), [jscs](https://github.com/jscs-dev/node-jscs)
The available tasks will be listed with a description and available arguments or aliases.

If no task name is given the **default task** will be executed. This will run all the tasks that are defined in the default task. Currently this is tests and check code styling.

# Configuration
For the most javascript tools there's a configuration file available. If the tool has a configuration file available it **should be available in your project root**.

Tasks that don't have a configuration file available have a default configuration and can be overridden by using command line arguments or the **dev-toolbox.config.json**. The tasks always use the tools that are installed locally by your npm dependencies. If npm has not installed the required tool, it will always be installed before the task will run. The tools can be found in **node_modules/.bin** in your project root.

## dev-toolbox.config.json
The toolbox has a configuration file that can be used to configure the toolbox and the tasks.

### tasks
Instead of setting the source of the task as a command line argument using *--source=<path/**/*.js>* for example. You can set it directly in the configuration. This why you can start multiple task with different sources and also don't have to pass the source argument every time you want to execute the task.

The tools used in the tasks often has options that can be applied. The options can also be set in the configuration. For available options see the documentation of the tool itself.

**Example:**
```json
{
  "tasks": {
    "syntax": {
      "source": ["lib/**/*.js", "tests/**/*.js"]
    },
    "codestyle": {
      "source": ["lib/**/*.js", "tests/**/*.js"],
      "options": {
        "fix": true
      }
    }
  }
}
```
