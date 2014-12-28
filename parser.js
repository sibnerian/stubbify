var Transform = require('stream').Transform;

var Parser = function Parser () {
  Transform.call(this);

  this.shouldPush = true;

  this._beginStubRegex = Parser.DEFAULT_START_REGEX;
  this._endStubRegex = Parser.DEFAULT_END_REGEX;

  this._transform = function (data, encoding, done) {
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
};

Parser.prototype = Object.create(Transform.prototype);
Parser.DEFAULT_START_REGEX = new RegExp('^.*//[\\s]*STUB', 'i');
Parser.DEFAULT_END_REGEX = new RegExp('^.*//[\\s]*ENDSTUB', 'i');


module.exports = Parser;
