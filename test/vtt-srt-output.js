const test = require('tape')
const { parse } = require('../dist/vtt-parser');
const { generate } = require('../dist/srt-generator');

const SAMPLE = `WEBVTT

NOTE: Wra = 231   ds      
NOTE Different


::cue(.red){ color: green; }
::cue(.yellow){ color: lime; }

101
00:00:02.200 --> 00:00:05.200 line:70% position:50% align:middle
<c.yellow>Yes, hello yes</c>
<c.yellow>Good good</c>
<c.yellow>Wowza.</c>

92
00:00:06.200 --> 00:00:09.200 line:70% position:50% align:middle
<c.yellow>This won't be yellow</c>`;

const EXPECTED =`1
00:00:02,200 --> 00:00:05,200
Yes, hello yes
Good good
Wowza.

2
00:00:06,200 --> 00:00:09,200
This won't be yellow
`;

test('exports expected srt from vtt', t => {
  t.plan(1);
  const subData = parse(SAMPLE);
  const result = generate(subData)
  t.equal(result, EXPECTED);
});
