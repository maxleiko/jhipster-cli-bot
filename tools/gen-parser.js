const fs = require('fs');
const path = require('path');
const peg = require('pegjs');

const GRAMMAR = path.resolve(__dirname, '../grammar/prompt.pegjs');

const grammar = fs.readFileSync(GRAMMAR, 'utf8');
const parser = peg.generate(grammar, { output: 'source', format: 'commonjs' });

console.log(parser);
