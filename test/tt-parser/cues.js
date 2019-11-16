const test = require('tape')
const { parse } = require('../../dist/tt-parser');
const { TagType } = require('../../dist/types');

const makeSample = cues => `<?xml version="1.0" encoding="utf-8"?> <tt xmlns="http://www.w3.org/2006/10/ttaf1" xmlns:ttp="http://www.w3.org/2006/10/ttaf1#parameter" ttp:timeBase="media" xmlns:tts="http://www.w3.org/2006/10/ttaf1#style" xml:lang="en" xmlns:ttm="http://www.w3.org/2006/10/ttaf1#metadata">
  <head></head>
  <body tts:textAlign="center" style="s0">
    <div>
      ${cues.join('\n')}
    </div>
  </body>
</tt>`;

test('parses simple br cue', t => {
  t.plan(1);
  const sample = makeSample([
    '<p begin="00:03:01.88" end="00:03:04.64">normal <br />usual</p>',
  ]);
  const { blocks: cues } = parse(sample);
  const [cue] = cues;
  t.deepEqual(cue.lines, [
    [
      'normal ',
    ],
    [
      'usual',
    ],
  ]);
});

test('parses single line bold cue', t => {
  t.plan(1);

  const sample = makeSample([
    '<p begin="00:03:01.88" end="00:03:04.64">normal <b>metadata</b> usual</p>',
  ]);
  const { blocks: cues } = parse(sample);
  const [cue] = cues;
  t.deepEqual(cue.lines, [
    [
      'normal ',
      {
        tag: { type: TagType.Bold },
        children: [
          'metadata'
        ]
      },
      ' usual',
    ],
  ]);
});

test('parses complex cues', t => {
  t.plan(1);

  const sample = makeSample([
    '<p begin="00:03:01.88" end="00:03:04.64">normal <b>meta<br />data</b> usual</p>',
  ]);
  const { blocks: cues } = parse(sample);
  const [cue] = cues;
  t.deepEqual(cue.lines, [
    [
      'normal ',
      {
        tag: { type: TagType.Bold },
        children: [
          'meta'
        ]
      },
    ],
    [
      {
        tag: { type: TagType.Bold },
        children: [
          'data'
        ]
      },
      ' usual',
    ]
  ]);
});
