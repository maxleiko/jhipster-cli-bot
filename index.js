const { spawn } = require('child_process');
const tmp = require('tmp');
const parseQuestion = require('./lib/parse-question');
const answerQuestion = require('./lib/answer-question');

let counter = 0;
const tmpDir = tmp.dirSync();

const jhipster = spawn('yo', ['jhipster', '--skip-install', '--skip-cache'], {
  cwd: tmpDir.name,
  stdio: [null, null, 'ignore']
});

console.log(`=== Spawning JHipster in ${tmpDir.name} ===`);

jhipster.stdout.on('data', (data) => {
  const question = parseQuestion(data + '');
  if (question) {
    const id = counter++;
    console.log(`Question ${id}:`);
    console.log(question);
    const answer = answerQuestion(question);
    if (answer) {
      console.log(`Answer ${id}:`);
      console.log(answer.human);
      console.log();
      jhipster.stdin.write(answer.stdin);
    }
  } else {
    jhipster.stdin.write(answerQuestion.ENTER);
  }
});

jhipster.on('close', (code) => {
  if (code !== 0) {
    console.log(`"yo jhipster" process exited with code ${code}`);
  }
});
