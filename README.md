# Stubbify - the File Stubbing Helper

  [![NPM Version][npm-image]][npm-url]
  [![Build Status][travis-image]][travis-url]

## Installation
```
npm install -g stubbify
```

## Usage

```
Usage: stubbify [file ...] [targetDir]

Options:

  -h, --help                 output usage information
  -V, --version              output the version number
  -b, --begin-stub [string]  RegEx string (JS-style) for stub begin delimiter (case-insensitive)
  -e, --end-stub [string]    RegEx string (JS-style) for stub end delimiter (case-insensitive)
  -s, --silent               Suppress printing of stubbified file paths
```

See also the [Grunt](http://gruntjs.com/) plugin, [grunt-stubbify](https://github.com/isibner/grunt-stubbify).

## About

Stubbify was created for [CIS 197](http://www.seas.upenn.edu/~cis197) to easily create homework boilerplate (for students to complete) from existing homework solutions. If we run `stubbify homework.js studentHW`, with the following `homework.js`:

```javascript
var add = function (a, b) {
  // add the two input integers together
  // STUB
  return a + b;
  // ENDSTUB
}
```

Then the stubs will be removed, leaving the following in `studentHW/homework.js`:
```javascript
var add = function (a, b) {
  // add the two input integers together
}
```

The default delimiters are `// STUB` and `// ENDSTUB`, but these can be changed with the `--begin-stub` and `--end-stub` options to support other languages or preferences.

Any number of files can be provided, and file arguments can also be glob patterns (like `**/*.js`). Glob patterns must be passed as strings, and the last argument must always be the target directory.

Stubbify preserves the relative paths of the stubbed-out files, so `foo/bar/baz/quux.js` will be copied into `targetDir/foo/bar/baz/quux.js`. This is so you can easily use stubbify as part of your build process for a student homework directory:
```
$ stubbify js/homeworkFile1.js js/homeworkFile2.js js/util/homeworkUtil.js student-homework
$ stubbify "js/**/*.js" student-homework # equivalent with glob pattern
$ tree .
.
├── js
│   ├── homeworkFile1.js
│   ├── homeworkFile2.js
│   └── util
│       └── homeworkUtil.js
└── student-homework
    └── js
        ├── homeworkFile1.js
        ├── homeworkFile2.js
        └── util
            └── homeworkUtil.js
```

[npm-image]: https://img.shields.io/npm/v/stubbify.svg?style=flat
[npm-url]: https://www.npmjs.com/package/stubbify
[travis-image]: https://img.shields.io/travis/isibner/stubbify.svg?style=flat
[travis-url]: https://travis-ci.org/isibner/stubbify
