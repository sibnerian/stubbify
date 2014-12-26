Stubbify - the File Stubbing Helper
=================================

## Installing
```
npm install -g stubbify
```

## Usage

```
Usage: stubbify [file ...] [targetDir]

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    -b, --beginning-stub [regex]  JavaScript-style regex for beginning of stub (case-insensitive)
    -e, --ending-stub [regex]     JavaScript-style regex for end of stub (case-insensitive)
```

## About

Stubbify was created for [CIS 197](http://www.seas.upenn.edu/~cis197) to easily create homework boilerplate (for students to complete) from existing homework solutions. If we run `stubbify homework.js studentHW`, with the following `homework.js`:

```
var add = function (a, b) {
  // add the two input integers together
  // STUB
  return a +b;
  // ENDSTUB
}
```

Then the stubs will be removed, leaving the following in `studentHW/homework.js`:
```
var add = function (a, b) {
  // add the two input integers together
}
```
By default, `// STUB` and `// ENDSTUB` are used as the delimiters, but you can change that easily with the `--begining-stub` and `--ending-stub` options.

Any number of files can be passed in, as long as the last argument is the target directory. Stubbify also supports *globs* (like `**/*.js`) through [node-glob](https://github.com/isaacs/node-glob).

Stubbify preserves the relative path of the stubbed-out files - `foo/bar/baz/quux.js` will be copied into `targetDir/foo/bar/baz/quux.js`. This is so you can easily use stubbify as part of your build process for a student homework directory:
```
$ stubbify js/homeworkFile1.js js/homeworkFile2.js js/util/homeworkUtil.js student-homework
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
