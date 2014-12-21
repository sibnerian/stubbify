var Transform = require('stream').Transform;

var parser = new Transform();

parser.shouldPush = true;

parser.DEFAULT_START_REGEX = new RegExp('^.*//[\\s]*STUB', 'i');
parser.DEFAULT_END_REGEX = new RegExp('^.*//[\\s]*ENDSTUB', 'i');

parser._beginStubRegex = parser.DEFAULT_START_REGEX;
parser._endStubRegex = parser.DEFAULT_END_REGEX;

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
