const test = require('tape')
const { parse } = require('../dist/vtt-parser');
const { generate } = require('../dist/srt-generator');

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
  t.plan(2);
  const result = parse(SAMPLE);
  const [cue] = result.blocks;
  t.equal(cue.id, '1');
  t.deepEqual(cue.range, {
    start: { hours: 0, minutes: 0, seconds: 2, milliseconds: 200 },
    end: { hours: 0, minutes: 0, seconds: 5, milliseconds: 200 }
  });
});
