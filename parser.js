var Transform = require('stream').Transform;

var parser = new Transform();

parser.shouldPush = true;

parser._beginStubRegex = new RegExp('^.*//[\\s]*STUB', 'i');
parser._endStubRegex = new RegExp('^.*//[\\s]*ENDSTUB', 'i');

parser._transform = function (data, encoding, done) {
  data = data + '';
  if (this._beginStubRegex.test(data)) {
    this.shouldPush = false;
  }
  if (this.shouldPush) {
    this.push(data);
    this.push('\n');
  }
  if (this._endStubRegex.test(data)) {
    this.shouldPush = true;
  }
  done();
};

module.exports = parser;
