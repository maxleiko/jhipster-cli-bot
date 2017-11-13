const { isDefaultValue } = require('./helpers');

const REGEX = /^\?([\s\S]*)\?( \((.*)\))?[\s\S]?((❯ [\s\S]*)|(❯(◯|◉) [\s\S]*))?/;

function parseQuestion(input) {
  const match = REGEX.exec(input);
  if (match) {
    const result = {};
    result.question = match[1].trim();
    if (match[3]) {
      // either a helper for list/checkbox/confirm or the default value of input
      const helper = match[3].trim();
      if (isDefaultValue(helper)) {
        result.default = helper;
      }
    } else {
      return;
    }
    if (match[6]) {
      // checkbox
      result.type = 'list';
      const choices = match[4].trim().split('\n').map((t) => t.trim());
      result.default = choices.filter((c) => c.startsWith('❯◉')).map((c, i) => i); // return indexes
      result.choices = choices.map((c) => c.substring(3)); // remove "❯◉ " or just " ◉ "));
    } else if (match[4]) {
      // list
      result.type = 'list';
      const choices = match[4].trim().split('\n').map((t) => t.trim());
      result.default = choices.findIndex((c) => c.startsWith('❯'));
      result.choices = choices.map((c) => c.substring(2)); // remove "❯ " or just "  "
    }
    return result;
  }
  return null;
}

module.exports = parseQuestion;
