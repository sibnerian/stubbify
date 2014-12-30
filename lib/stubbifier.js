var _ = require('highland');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

var cwd = process.cwd();

var parser = function (beginStub, endStub) {
  var pushing = true;

  return function (err, line, push, next) {
    if (err) {
      push(err);
      next();
    } else if (line === _.nil) {
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
  return function (file, cb) {
    mkdirp.sync(path.join(cwd, targetDir, path.dirname(file)));
    var source = fs.createReadStream(path.join(cwd, file));
    var destination = fs.createWriteStream(path.join(cwd, targetDir, file));

    destination.on('finish', function () {
      cb(null, file);
    });
    destination.on('error', cb);

    _(source)
      .split()
      .consume(parser(beginStub, endStub))
      .intersperse('\n')
      .pipe(destination);
  };
};

stubbifier.parser = parser;
module.exports = stubbifier;
