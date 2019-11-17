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

9
00:00:06.200 --> 00:00:09.200 line:70% position:50% align:middle
word <b>then</b> this.
<b>This</b> won't be normal
<i>Nested <b>boldtalic</b> tal</i>

92
00:00:09.200 --> 00:00:19.200 line:70% position:50% align:middle
<c.yellow>This won't be yellow</c>`;


const EXPECTED =`1
00:00:02,200 --> 00:00:05,200
Yes, hello yes
Good good
Wowza.

2
00:00:06,200 --> 00:00:09,200
word then this.
This won't be normal
Nested boldtalic tal

3
00:00:09,200 --> 00:00:19,200
This won't be yellow
`;

test('exports expected unstyled srt from vtt', t => {
  t.plan(1);
  const subData = parse(SAMPLE);
  const result = generate(subData, { enableStyles: false })
  t.equal(result, EXPECTED);
});
