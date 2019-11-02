const test = require('tape')
const { parse } = require('../../dist/vtt-parser');
const { TagType } = require('../../dist/types');

const SIMPLE_SAMPLE = `WEBVTT

12
00:00:02.200 --> 00:00:05.200 line:70% position:50% align:middle
- Foo`;

test('parses a cue id', t => {
  t.plan(1);
  const result = parse(SIMPLE_SAMPLE);
  const [cue] = result.blocks;
  t.equal(cue.id, '12');
});

test('parses a cue timestamp', t => {
  t.plan(1);
  const result = parse(SIMPLE_SAMPLE);
  const [cue] = result.blocks;
  t.deepEqual(cue.range, {
    start: {
      hours: 0, minutes: 0, seconds: 2, milliseconds: 200
    },
    end: {
      hours: 0, minutes: 0, seconds: 5, milliseconds: 200
    }
  });
});

const SAMPLE = `WEBVTT

NOTE: Wra = 231   ds      
NOTE Different


::cue(.red){ color: green; }
::cue(.yellow){ color: lime; }

1
00:00:02.200 --> 00:00:05.200 line:70% position:50% align:middle
<c.yellow>Yes, hello yes</c>
<c.yellow>Good good</c>
<c.yellow>Wowza.</c>`;

test('parses timestamps for a cue from sample', t => {
  t.plan(1);
  const result = parse(SAMPLE);
  const [cue] = result.blocks;
  t.deepEqual(cue.range, {
    start: { hours: 0, minutes: 0, seconds: 2, milliseconds: 200 },
    end: { hours: 0, minutes: 0, seconds: 5, milliseconds: 200 }
  });
});

test('parses cue text from sample', t => {
  t.plan(1);
  const result = parse(SAMPLE);
  const [cue] = result.blocks;
  const [firstLine] = cue.lines;
  t.deepEqual(firstLine, {
    children: [
      {
        tag: {
          type: TagType.Class,
          className: 'yellow',
        },
        children: [ 'Yes, hello yes' ]
      }
    ]
  });
});

test('parses settings for a cue from sample', t => {
  t.plan(2);
  const result = parse(SAMPLE);
  const [cue] = result.blocks;
  t.ok(cue.settings !== null);
  t.deepEqual(cue.settings, {
    vertical: null,
    line: { value: 70 },
    position: { value: 50 },
    size: null,
    align: 'middle',
  });
});
