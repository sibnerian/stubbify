var byline = require('byline');
var fs = require('fs');
var mkdirp = require('mkdirp');
var parser = require('./parser.js');
var path = require('path');

var stubbify = function (file, targetDir, stubStartRegex, stubEndRegex) {
  parser._beginStubRegex = stubStartRegex || parser.DEFAULT_START_REGEX;
  parser._endStubRegex = stubEndRegex || parser.DEFAULT_END_REGEX;

  var rawInput = fs.createReadStream(path.join(process.cwd(), file));
  mkdirp.sync(path.join(process.cwd(), targetDir, path.dirname(file)));
  var destination = fs.createWriteStream(path.join(process.cwd(), targetDir, file));
  byline(rawInput).pipe(parser).pipe(destination);
};

module.exports = stubbify;
