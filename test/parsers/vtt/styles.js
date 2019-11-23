const test = require('tape')
const { parse } = require('../../../dist/parsers/vtt');

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
  const { styles } = parse(SAMPLE);
  t.equal(styles.length, 2);
  t.deepEqual(styles[0], {
    selector: { class: 'red' },
    properties: {
      color: 'green',
    },
  });
});

const MULTILINE_SAMPLE = `WEBVTT

::cue(b) {
  color: peachpuff;
  opacity: 0.55;
}

1
00:00:02.200 --> 00:00:05.200
<c.yellow>Wowza.</c>`;

test('parses multi-line styles from sample', t => {
  t.plan(1);
  const { styles } = parse(MULTILINE_SAMPLE);
  t.deepEqual(styles, [
    {
      selector: { element: 'b' },
      properties: {
        color: 'peachpuff',
        opacity: 0.55,
      },
    }
  ]);
});

const ID_SAMPLE = `WEBVTT

::cue(#\\31) { color: lime; }
::cue(#\\31 23) { color: aliceblue; }
::cue(#crédit\ de\ transcription) { color: red; }

1
00:00.000 --> 00:02.000
That’s an, an, that’s an L!

123
00:00.200 --> 00:02.500
Woaw

crédit de transcription
00:04.000 --> 00:05.000
Transcrit par Célestes™
`;

test('parses styles with ids from sample', t => {
  t.plan(1);
  const { styles } = parse(ID_SAMPLE);
  t.deepEqual(styles, [
    {
      selector: { id: '1' },
      properties: { color: 'lime' },
    },
    {
      selector: { id: '123' },
      properties: { color: 'aliceblue' },
    },
    {
      selector: { id: 'crédit de transcription' },
      properties: { color: 'red' },
    }
  ]);
});
