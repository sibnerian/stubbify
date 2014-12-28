var chai = require('chai'),
    assert = chai.assert,
    Transform = require('stream').Transform,
    parser = require('../parser.js');

describe('#parser', function () {
  var readable, writable;
  var writeableTransform;
  beforeEach(function () {
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
  });

  it('takes in a normal string', function (done) {
    var testString = 'hello world';
    pipeString(testString);

    setTimeout(function () {
      assert.strictEqual(testString + '\n', writable.result);
      done();
    }, 0);
  });

  it('does not take in beginStub', function (done) {
    var testString = '// STUB';
    pipeString(testString);
    
    setTimeout(function () {
      assert.notStrictEqual(testString + '\n', writable.result);
      assert.strictEqual('', writable.result);
      done();
    }, 0);
  });

  it('does not take in text after beginStub', function (done) {
    var testString = '//STUB \n hello world \n //ENDSTUB';
    pipeString(testString);

    setTimeout(function () {
      assert.notStrictEqual(testString + '\n', writable.result);
      assert.strictEqual('', writable.result);
      done();
    }, 0);
  });

  var pipeString = function (testString) {
    readable.push(testString);
    readable.pipe(parser).pipe(writable);
  };

});

