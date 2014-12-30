/*eslint-env node, mocha */

var _ = require('highland');
var chai = require('chai');
var parser = require('../lib/stubbifier').parser;
var config = require('../lib/config');

var assert = chai.assert;

var makeTest = function (input, expected) {
  return function (done) {
    _([input])
      .split()
      .consume(parser(config.defaultBeginStub, config.defaultEndStub))
      .intersperse('\n')
      .toArray(function (lines) {
        assert.strictEqual(expected, lines.join(''));
        done();
      });
  };
};

describe('#parser', function () {
  it('takes in a normal string',
    makeTest('hello world', 'hello world')
  );

  it('does not take in beginStub',
    makeTest('// STUB', '')
  );

  it('does not take in text after beginStub',
    makeTest('//STUB \n hello world \n //ENDSTUB', '')
  );
});
