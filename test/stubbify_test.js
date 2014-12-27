var fs = require('fs'),
    chai = require('chai'),
    assert = chai.assert,
    del = require('del'),
    parser = require('../parser.js'),
    stubbify = require('../stubbify.js');

describe('#stubbify', function () {
  var fixtures = './test/fixtures/',
      testFile = fixtures + 'example.js',
      stubbifiedFile = fixtures + 'tmp/test/fixtures/example.js',
      wantedFile = fixtures + 'stubbified.js',
      destinationDir = fixtures + 'tmp',
      testFileLines,
      stubbifiedFileLines,
      wantedFileLines,
      beginningStub = parser.DEFAULT_START_REGEX,
      endingStub = parser.DEFAULT_END_REGEX;

  before('read test, stubbified, and wanted files', function(done) {
    stubbify(testFile, destinationDir, beginningStub, endingStub);
    setTimeout(function() {
      testFileLines = readTestFile(testFile);
      stubbifiedFileLines = readTestFile(stubbifiedFile);
      wantedFileLines = readTestFile(wantedFile);
      done();
    }, 1000);
  });

  after(function() {
    del.sync(destinationDir, function (err, paths) {
      if (err) throw err;
    });
  });

  it('is different from original file', function (done) {
    assert.notDeepEqual(testFileLines, stubbifiedFileLines);
    done();
  });

  it('stubs correctly', function (done) {
    assert.deepEqual(stubbifiedFileLines, wantedFileLines);
    done();
  });

  var readTestFile = function (fileToRead) {
    var data = fs.readFileSync(fileToRead);
    data = data + '';
    return data.split('\n');
  };

});

