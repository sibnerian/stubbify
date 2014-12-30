/*eslint-env node, mocha */

var hl = require('highland');
var chai = require('chai');
var parser = require('../lib/stubbifier').parser;
var config = require('../lib/config');

var assert = chai.assert;

var makeTest = function (input, expected) {
  return function (done) {
    hl([input])
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

  it('drops beginStub',
    makeTest('// STUB', '')
  );

  it('drops text after beginStub',
    makeTest('//STUB \n hello world \n //ENDSTUB', '')
  );

  it('is case- and whitespace-insensitive',
    makeTest('//stub ', '')
  );

  it('drops text before beginStub in same line',
    makeTest('hello world // STUB', '')
  );

  it('leaves text before beginStub',
    makeTest('hello world\n// STUB', 'hello world')
  );

  it('leaves text below endStub',
    makeTest('// STUB\n// ENDSTUB\nhello world', 'hello world')
  );

  it('handles multiple beginStubs',
    makeTest('// STUB\n// STUB\n// ENDSTUB\nhello world', 'hello world')
  );
});
