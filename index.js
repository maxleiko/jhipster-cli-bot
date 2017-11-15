const { spawn } = require('child_process');
const tmp = require('tmp');
const stripAnsi = require('strip-ansi');
const parser = require('./lib/parser');
const answerQuestion = require('./lib/answer-question');

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
    const answer = answerQuestion(question);
    if (answer) {
      jhipster.stdin.write(answer.stdin);
    }
  } catch (ignore) {}
});

jhipster.on('close', (code) => {
  console.log(`"yo jhipster" process exited with code ${code}`);
});
