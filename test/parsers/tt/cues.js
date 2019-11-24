const test = require('tape')
const { parse } = require('../../../dist/parsers/tt');
const { TagType } = require('../../../dist/types');


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
      {
        tag: { type: TagType.Span, styleName: null, properties: {} }, children: [ 'normal ' ]
      }
    ],
    [
      {
        tag: { type: TagType.Span, styleName: null, properties: {} }, children: [ 'usual' ]
      }
    ],
  ]);
});

test('parses simple styled paragraph cue', t => {
  t.plan(1);
  const sample = makeSample([
    '<p style="s1" begin="00:03:01.88" end="00:03:04.64">normal <br />usual</p>',
  ]);
  const { blocks: cues } = parse(sample);
  const [cue] = cues;
  t.deepEqual(cue.lines, [
    [
      {
        tag: { type: TagType.Span, styleName: 's1', properties: {} },
        children: [ 'normal ' ]
      }
    ],
    [
      {
        tag: { type: TagType.Span, styleName: 's1', properties: {} },
        children: [ 'usual' ]
      }
    ],
  ]);
});

test('parses complex styled paragraph cue', t => {
  t.plan(1);
  const sample = makeSample([
    '<p style="s1" begin="00:03:01.88" end="00:03:04.64"><span style="s3">normal <br /></span>usual</p>',
  ]);
  const { blocks: cues } = parse(sample);
  const [cue] = cues;
  t.deepEqual(cue.lines, [
    [
      {
        tag: { type: TagType.Span, styleName: 's1', properties: {} },
        children: [
          {
            tag: { type: TagType.Span, styleName: 's3', properties: {} },
            children: [
              'normal '
            ]
          }
        ]
      }
    ],
    [
      {
        tag: { type: TagType.Span, styleName: 's1', properties: {} },
        children: [ 'usual' ]
      }
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
      {
        tag: { type: TagType.Span, styleName: null, properties: {} },
        children: [
          'normal ',
          {
            tag: { type: TagType.Bold },
            children: [
              'metadata'
            ]
          },
          ' usual',
        ]
      }
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
      {
        tag: { type: TagType.Span, styleName: null, properties: {} },
        children: [
          'normal ',
          {
            tag: { type: TagType.Bold },
            children: [
              'meta'
            ]
          },
        ]
      }
    ],
    [
      {
        tag: { type: TagType.Span, styleName: null, properties: {} },
        children: [
          {
            tag: { type: TagType.Bold },
            children: [
              'data'
            ]
          },
          ' usual'
        ]
      },
    ],
  ]);
});
