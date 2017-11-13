const DOWN = '\x1B\x5B\x42';
const UP = '\x1B\x5B\x41';
const ENTER = '\x0D';

function answerQuestion(question) {
  const answer = {};

  if (isNaN(question.default)) {
    if (question.default) {
      answer.human = question.default;
    } else {
      answer.human = '<default>';
    }
  } else {
    answer.human = question.choices[question.default];
  }

  // TODO do not answer "ENTER" everytime => try all possibilities
  answer.stdin = ENTER;
  return answer;
}

module.exports = answerQuestion;
module.exports.DOWN = DOWN;
module.exports.UP = UP;
module.exports.ENTER = ENTER;
