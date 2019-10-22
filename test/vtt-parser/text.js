const test = require('tape')
const { TagType } = require('../../dist/types');
const { parseCueLine } = require('../../dist/vtt-parser/cue-text');

test('parses plain cue text', t => {
  t.plan(1);
  const result = parseCueLine('Yes, hello yes');
  t.deepEqual(result, {
    children: [
      'Yes, hello yes'
    ]
  });
});

test('parses bold cue text', t => {
  t.plan(1);
  const result = parseCueLine('Yes, <b>hello</b> yes');
  t.deepEqual(result, {
    children: [
      'Yes, ',
      {
        tag: {
          type: TagType.Bold,
        },
        children: [ 'hello' ]
      },
      ' yes'
    ]
  });
});

test('parses cue text with class', t => {
  t.plan(1);
  const result = parseCueLine('<c.yellow>Good good</c>');
  t.deepEqual(result, {
    children: [
      {
        tag: {
          type: TagType.Class,
          className: 'yellow',
        },
        children: [
          'Good good'
        ]
      }
    ]
  });
});

test('parses cue text with nested tags', t => {
  t.plan(1);
  const result = parseCueLine('<c.yellow>Good <b>bad</b> good</c>');
  t.deepEqual(result, {
    children: [
      {
        tag: {
          type: TagType.Class,
          className: 'yellow',
        },
        children: [
          'Good ',
          {
            tag: {
              type: TagType.Bold,
            },
            children: [ 'bad' ]
          },
          ' good'
        ]
      }
    ]
  });
});
