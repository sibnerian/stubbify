var byline = require('byline');
var fs = require('fs');
var mkdirp = require('mkdirp');
var Parser = require('./parser.js');
var path = require('path');

var stubbify = function (file, targetDir, stubStartRegex, stubEndRegex, cb) {
  var parser = new Parser();
  parser._beginStubRegex = stubStartRegex || Parser.DEFAULT_START_REGEX;
  parser._endStubRegex = stubEndRegex || Parser.DEFAULT_END_REGEX;

  var rawInput = fs.createReadStream(path.join(process.cwd(), file));
  mkdirp.sync(path.join(process.cwd(), targetDir, path.dirname(file)));
  var destination = fs.createWriteStream(path.join(process.cwd(), targetDir, file));
  byline(rawInput).pipe(parser).pipe(destination);

  destination.on('finish', function () {
    cb(null);
  });
  destination.on('error', cb);
};

module.exports = stubbify;
