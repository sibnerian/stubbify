#!/usr/bin/env node
/*eslint no-process-exit: 0*/

var program = require('commander');
var stubbify = require('./stubbify.js');

program._name = 'stubbify';
program._usage = '[file ...] [targetDir]';

program
  .version('0.0.4')
  .option('-b, --beginning-stub [regex]', 'JavaScript-style regex for beginning of stub (case-insensitive)')
  .option('-e, --ending-stub [regex]', 'JavaScript-style regex for end of stub (case-insensitive)')
  .parse(process.argv);

if (program.args.length < 2) {
  console.log('Not enough arguments - must be at least one file and target directory.');
  process.exit();
}

var stubStartRegex, stubEndRegex;

if (program.beginningStub !== undefined) {
  stubStartRegex = new RegExp(program.beginningStub, 'i');
}

if (program.endingStub !== undefined) {
  stubEndRegex = new RegExp(program.endingStub, 'i');
}

var targetDir = program.args.pop();

program.args.forEach(function (file) {
  stubbify(file, targetDir, stubStartRegex, stubEndRegex);
});
