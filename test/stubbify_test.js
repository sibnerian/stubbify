/*eslint-env node, mocha */

var chai = require('chai');
var del = require('del');
var fs = require('fs');
var stubbifier = require('../lib/stubbifier');

var assert = chai.assert;

describe('#stubbify', function () {
  var fixturesPath = './test/fixtures/';
  var targetDir = fixturesPath + 'tmp';
  var htmlStubbify = stubbifier(targetDir, '^.*<!--[\\s]*STUB[\\s]*-->', '^.*<!--[\\s]*ENDSTUB[\\s]*-->');

  var textComparator = function (bufferExpected, bufferActual) {
    assert.strictEqual(bufferExpected.toString(), bufferActual.toString());
  };

  var binaryComparator = function (bufferExpected, bufferActual) {
    assert.strictEqual(bufferExpected.toString('hex'), bufferActual.toString('hex'));
  };

  var stubbifyAndCompare = function (input, expected, stubbify, comparator) {
    stubbify = stubbify || stubbifier(targetDir);
    comparator = comparator || textComparator;
    var inputPath = fixturesPath + input;
    var outputPath = fixturesPath + 'tmp/test/fixtures/' + input;
    var expectedPath = fixturesPath + expected;

    return function (done) {
      stubbify(inputPath, function (err) {
        assert.isNull(err);
        var bufferExpected = fs.readFileSync(expectedPath);
        var bufferActual = fs.readFileSync(outputPath);
        comparator(bufferExpected, bufferActual);
        done();
      });
    };
  };

  afterEach(function () {
    del.sync(targetDir);
  });

  it('stubbifies a basic file',
    stubbifyAndCompare('example.js', 'example_out.js')
  );

  it('does not modify a stubless file',
    stubbifyAndCompare('stubless.js', 'stubless_out.js')
  );

  it('behaves like comments for nested stubs',
    stubbifyAndCompare('nested.js', 'nested_out.js')
  );

  it('stubbifies with different delimiters',
    stubbifyAndCompare('example.html', 'example_out.html', htmlStubbify)
  );

  it('stubbifies binary files without changing them',
    stubbifyAndCompare('penguin.jpg', 'penguin.jpg', undefined, binaryComparator)
  );
});
