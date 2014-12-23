var fs = require('fs');
var chai = require('chai');
var should = require('should');
var parser = require('../parser.js');
var stubbify = require('../stubbify.js');

describe('stubbify', function() {
  
  describe('#stubbify', function() {
    var testFile = './test/fixtures/example.js';
    var destination = './stubbified';
    var beginningStub = parser.DEFAULT_START_REGEX;
    var endingStub = parser.DEFAULT_END_REGEX;
 
    it('there are stubs to begin with', function() {
      //var found = readTestFile();
      readTestFile().should.equal(true);
    });

    it('stubs correctly', function() {
      stubbify(testFile, destination, beginningStub, endingStub);
      var found = readTestFile();
      found.should.equal(false);
    });

    var readTestFile = function() {
      return fs.readFile(testFile, function(err, data) {
        if(err) throw err;

        data = data + '';
        /*var lines = data.split('\n');*/
        //for (var i = 0; i < lines.length; i++) {
          //var line = lines[i];
          //if(beginningStub.test(line) || endingStub.test(line)) {
            //return true;
          //}
        //}
        /*return false;*/
        data.split('\n').forEach(function(line) {
          if(beginningStub.test(line) || endingStub.test(line)) {
            return true;
          }
        });
        return false;
      });
    }

  });

});
