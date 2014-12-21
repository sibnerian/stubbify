#!/usr/bin/env node

var _ = require('lodash');
var byline = require('byline');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var parser = require('./parser.js');
var program = require('commander');

program._name = 'stubbify';
program._usage = '[file ...] [targetDir]';

program
  .version('0.0.1')
  .option('-b, --beginning-stub [regex]', 'JavaScript-style regex for beginning of stub (case-insensitive)')
  .option('-e, --ending-stub [regex]', 'JavaScript-style regex for end of stub (case-insensitive)')
  .parse(process.argv);

if (program.args.length < 2) {
  console.log('Not enough arguments - must be at least one file and target directory.');
  process.exit();
}

if (program.beginningStub !== undefined) {
  parser._beginStubRegex = new RegExp(program.beginningStub, 'i');
}

if (program.endingStub !== undefined) {
  parser._endStubRegex = new RegExp(program.endingStub, 'i');
}

var targetDir = program.args.pop();

_.each(program.args, function (file) {
  var rawInput = fs.createReadStream(path.join(process.cwd(), file));
  mkdirp.sync(path.join(process.cwd(), targetDir, path.dirname(file)));
  var destination = fs.createWriteStream(path.join(process.cwd(), targetDir, file));
  byline(rawInput).pipe(parser).pipe(destination);
});
