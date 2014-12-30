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

  var stubbifyAndCompare = function (input, expected, stubbify) {
    stubbify = stubbify || stubbifier(targetDir);
    var inputPath = fixturesPath + input;
    var outputPath = fixturesPath + 'tmp/test/fixtures/' + input;
    var expectedPath = fixturesPath + expected;

    return function (done) {
      stubbify(inputPath, function (err) {
        assert.isNull(err);
        var expectedContents = fs.readFileSync(expectedPath) + '';
        var outputContents = fs.readFileSync(outputPath) + '';
        assert.strictEqual(expectedContents, outputContents);
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
});
