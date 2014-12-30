#!/usr/bin/env node
/*eslint no-process-exit: 0*/

var hl = require('highland');
var glob = require('glob');
var path = require('path');
var program = require('commander');
var config = require('./lib/config');
var stubbifier = require('./lib/stubbifier');

program._name = 'stubbify';
program._usage = '[file ...] [targetDir]';

program
  .version('0.0.6')
  .option('-b, --begin-stub [string]', 'RegEx string (JS-style) for stub begin delimiter (case-insensitive)')
  .option('-e, --end-stub [string]', 'RegEx string (JS-style) for stub end delimiter (case-insensitive)')
  .option('-s, --silent', 'Suppress printing of stubbified file paths')
  .parse(process.argv);

if (program.args.length < 2) {
  console.log('Not enough arguments - must provide at least one file and a target directory.');
  process.exit();
}

var beginStub = config.defaultBeginStub;
var endStub = config.defaultEndStub;

if (program.beginStub !== undefined) {
  beginStub = new RegExp(program.beginStub, 'i');
}

if (program.endStub !== undefined) {
  endStub = new RegExp(program.endStub, 'i');
}

var targetDir = program.args.pop();
var stubbify = stubbifier(targetDir, beginStub, endStub);

hl(program.args)
  .flatMap(hl.wrapCallback(glob)).series()
  .flatMap(hl.wrapCallback(stubbify))
  .toArray(function (files) {
    if (!program.silent) {
      console.log('Stubbified the following files:');
      files.forEach(function (file) {
        console.log(file + ' -> ' + path.join(targetDir, file));
      });
    }
  });
