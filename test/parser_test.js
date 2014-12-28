/*eslint-env node, mocha */

var chai = require('chai');
var Transform = require('stream').Transform;
var Parser = require('../parser.js');

var assert = chai.assert;

describe('#parser', function () {
  var readable, writable;
  var parser;

  beforeEach(function () {
    parser = new Parser();
    readable = new Transform();
    writable = new Transform();
    writable.result = '';
    writable._transform = function (data, encoding, done) {
      if (data !== undefined) {
        data = data + '';
        this.result += data;
      }
      done();
    };
    readable.pipe(parser).pipe(writable);
  });

  it('takes in a normal string', function (done) {
    var testString = 'hello world';
    readable.push(testString);
    readable.end();
    writable.on('finish', function () {
      assert.strictEqual(testString + '\n', writable.result);
      done();
    });
  });

  it('does not take in beginStub', function (done) {
    var testString = '// STUB';
    readable.push(testString);
    readable.end();

    writable.on('finish', function () {
      assert.notStrictEqual(testString + '\n', writable.result);
      assert.strictEqual('', writable.result);
      done();
    });
  });

  it('does not take in text after beginStub', function (done) {
    var testString = '//STUB \n hello world \n //ENDSTUB';
    readable.push(testString);
    readable.end();

    writable.on('finish', function () {
      assert.notStrictEqual(testString + '\n', writable.result);
      assert.strictEqual('', writable.result);
      done();
    });
  });
});
