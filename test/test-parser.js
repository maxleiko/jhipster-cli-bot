const fs = require('fs');
const path = require('path');
const { deepEqual } = require('assert');
const parser = require('../lib/parser');

function parse(prompt) {
  const filepath = path.join(__dirname, 'fixtures', 'prompts', prompt);
  const file = fs.readFileSync(filepath, 'utf8');
  return parser.parse(file);
}

describe('test parser', () => {
  it('checkbox', () => {
    const result = parse('checkbox');
    deepEqual(result, {
      question: 'Select toppings',
      type: 'checkbox',
      choices: [
        { separator: '= The Meats =' },
        'Pepperoni',
        'Ham',
        'Ground Meat',
        'Bacon',
        { separator: '= The Cheeses =' },
        'Mozzarella'
      ],
      selected: [6]
    });
  });

  it('confirm', () => {
    const result = parse('confirm');
    deepEqual(result, {
      question: 'Is this for delivery?',
      type: 'confirm',
      default: false
    });
  });

  it('expand', () => {
    const result = parse('expand');
    deepEqual(result, {
      question: 'What about the toppings?',
      type: 'expand',
      default: 3,
      choices: ['p', 'a', 'w', 'H']
    });
  });

  it('input', () => {
    const result = parse('input');
    deepEqual(result, {
      question: 'What\'s your first name',
      type: 'input'
    });
  });

  it('list', () => {
    const result = parse('list');
    deepEqual(result, {
      question: 'What size do you need?',
      type: 'list',
      choices: ['Large', 'Medium', 'Small'],
      default: 0
    });
  });

  it('long-list', () => {
    const result = parse('long-list');
    deepEqual(result, {
      question: 'What\'s your favorite letter?',
      type: 'list',
      choices: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      default: 0,
      scrollable: true
    });
  });

  it('rawlist', () => {
    const result = parse('rawlist');
    deepEqual(result, {
      question: 'You also get a free 2L beverage',
      type: 'rawlist',
      choices: ['Pepsi', '7up', 'Coke']
    });
  });

  it('rawlist-separator', () => {
    const result = parse('rawlist-separator');
    deepEqual(result, {
      question: 'What do you want to do?',
      type: 'rawlist',
      choices: [
        'Order a pizza',
        'Make a reservation',
        { separator: '──────────────' },
        'Ask opening hours',
        'Talk to the receptionist'
      ]
    });
  });
});
