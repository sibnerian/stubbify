var fs = require('fs'),
    chai = require('chai'),
    expect = chai.expect,
    del = require('del'),
    parser = require('../parser.js'),
    stubbify = require('../stubbify.js');

describe('stubbify', function () {
  var testFile = './test/fixtures/example.js';
  var stubbifiedFile = './test/fixtures/tmp/test/fixtures/example.js';
  var destination = './test/fixtures/tmp';
  var beginningStub = parser.DEFAULT_START_REGEX;
  var endingStub = parser.DEFAULT_END_REGEX;

  before(function() {
    stubbify(testFile, destination, beginningStub, endingStub);
    readTestFile(stubbifiedFile);
  });

  after(function() {
    del.sync('./test/fixtures/tmp', function (err, paths) {
      if (err) throw err;
    });
  });

  it('stubs correctly', function (done) {
      done();
  });

  var readTestFile = function (fileToRead) {
    fs.readFile(fileToRead, function(err, data) {
      if(err) throw err;

      data = data + '';
      var lines = data.split('\n');
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if(beginningStub.test(line) || endingStub.test(line)) {
          found = 'was found';
        }
      }
    });
  };

});

