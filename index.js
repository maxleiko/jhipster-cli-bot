const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
const tmp = require('tmp');
const stripAnsi = require('strip-ansi');
const parser = require('./lib/parser');
const answerQuestion = require('./lib/answer-question');

let counter = 0;
const tmpDir = tmp.dirSync();

const jhipster = spawn('yo', ['jhipster', '--skip-install', '--skip-cache'], {
  cwd: tmpDir.name,
  stdio: [null, null, 'ignore']
});

console.log(`=== Spawning JHipster in ${tmpDir.name} ===`);

jhipster.stdout.on('data', (data) => {
  const prompt = stripAnsi(data + '');
  try {
    const question = parser.parse(prompt);
    const id = counter++;
    fs.writeFile(path.join(tmpDir.name, `prompt${id}.txt`), prompt, 'utf8', () => {});
    fs.writeFile(path.join(tmpDir.name, `question${id}.txt`), JSON.stringify(question, null, 2), 'utf8', () => {});
    const answer = answerQuestion(question);
    if (answer) {
      fs.writeFile(path.join(tmpDir.name, `answer${id}.txt`), answer.human, 'utf8', () => {});
      jhipster.stdin.write(answer.stdin);
    }
  } catch (ignore) {}
});

jhipster.on('close', (code) => {
  if (code !== 0) {
    console.log(`"yo jhipster" process exited with code ${code}`);
  }
});
