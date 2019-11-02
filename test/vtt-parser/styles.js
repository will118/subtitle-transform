const test = require('tape')
const { parse } = require('../../dist/vtt-parser');

const SAMPLE = `WEBVTT

NOTE: Wra = 231   ds      
NOTE Different


::cue(.red){ color: green; }
::cue(.yellow){ color: lime; }

1
00:00:02.200 --> 00:00:05.200
<c.yellow>Wowza.</c>`;

test('parses styles from sample', t => {
  t.plan(2);
  const { blocks } = parse(SAMPLE);
  t.equal(blocks.length, 3);
  t.deepEqual(blocks[0], {
    name: 'red',
    styles: {
      color: 'green',
    },
  });
});
