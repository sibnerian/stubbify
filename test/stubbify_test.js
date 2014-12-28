/*eslint-env node, mocha*/

var chai = require('chai');
var del = require('del');
var fs = require('fs');
var Parser = require('../parser.js');
var stubbify = require('../stubbify.js');

var assert = chai.assert;

describe('#stubbify', function () {
  var fixturesPath = './test/fixtures/';
  var testFile = fixturesPath + 'example.js';
  var stubbifiedFile = fixturesPath + 'tmp/test/fixtures/example.js';
  var wantedFile = fixturesPath + 'stubbified.js';
  var destinationDir = fixturesPath + 'tmp';
  var beginningStub = Parser.DEFAULT_START_REGEX;
  var endingStub = Parser.DEFAULT_END_REGEX;

  var readTestFile = function (fileToRead) {
    var data = fs.readFileSync(fileToRead);
    data = data + '';
    return data.split('\n');
  };

  var testFileLines, stubbifiedFileLines, wantedFileLines;

  before('read test, stubbified, and wanted files', function (done) {
    stubbify(testFile, destinationDir, beginningStub, endingStub, function (err) {
      assert.isNull(err);
      testFileLines = readTestFile(testFile);
      stubbifiedFileLines = readTestFile(stubbifiedFile);
      wantedFileLines = readTestFile(wantedFile);
      done();
    });
  });

  after(function () {
    del.sync(destinationDir);
  });

  it('is different from original file', function () {
    assert.notDeepEqual(testFileLines, stubbifiedFileLines);
  });

  it('stubs correctly', function () {
    assert.deepEqual(stubbifiedFileLines, wantedFileLines);
  });
});
