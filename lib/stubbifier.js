var config = require('./config');
var fs = require('fs');
var hl = require('highland');
var isTextSync = require('istextorbinary').isTextSync;
var mkdirp = require('mkdirp');
var path = require('path');

var cwd = process.cwd();

var parser = function (beginStub, endStub) {
  beginStub = beginStub || config.defaultBeginStub;
  beginStub = typeof beginStub === 'string' ? RegExp(beginStub, 'i') : beginStub;
  endStub = endStub || config.defaultEndStub;
  endStub = typeof endStub === 'string' ? RegExp(endStub, 'i') : endStub;
  var pushing = true;

  return function parse(err, line, push, next) {
    if (err) {
      push(err);
      next();
    } else if (line === hl.nil) {
      push(null, line);
    } else {
      if (beginStub.test(line)) {
        pushing = false;
      } else if (endStub.test(line)) {
        pushing = true;
      } else if (pushing) {
        push(null, line);
      }
      next();
    }
  };
};

var stubbifier = function (targetDir, beginStub, endStub) {
  return function stubbify(file, cb) {
    var filePath = path.join(cwd, file);
    mkdirp.sync(path.join(cwd, targetDir, path.dirname(file)));
    var source = fs.createReadStream(filePath);
    var destination = fs.createWriteStream(path.join(cwd, targetDir, file));

    destination.on('finish', function () {
      cb(null, file);
    });
    destination.on('error', cb);

    if (isTextSync(filePath) || isTextSync(filePath, fs.readFileSync(filePath))) {
      hl(source)
      .split()
      .consume(parser(beginStub, endStub))
      .intersperse('\n')
      .pipe(destination);
    } else {
      source.pipe(destination);
    }
  };
};

stubbifier.parser = parser;
module.exports = stubbifier;
