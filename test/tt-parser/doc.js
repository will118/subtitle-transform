const test = require('tape')
const { parse } = require('../../dist/tt-parser');
const { TagType } = require('../../dist/types');

const SAMPLE = `<?xml version="1.0" encoding="utf-8"?> <tt xmlns="http://www.w3.org/2006/10/ttaf1" xmlns:ttp="http://www.w3.org/2006/10/ttaf1#parameter" ttp:timeBase="media" xmlns:tts="http://www.w3.org/2006/10/ttaf1#style" xml:lang="en" xmlns:ttm="http://www.w3.org/2006/10/ttaf1#metadata">
  <head>
    <!--Created on 1/11/2011 at 00:30:00-->
    <metadata>
      <ttm:title>
        Yellow eggs and potatoes
      </ttm:title>
      <ttm:copyright>
        AuthorName
      </ttm:copyright>
    </metadata>
    <styling>
      <style id="s1" style="s0" tts:color="yellow" />
      <style id="s0" tts:backgroundColor="black" tts:fontStyle="normal" tts:fontSize="16" tts:fontFamily="sansSerif" tts:color="white" />
    </styling>
  </head>
  <body tts:textAlign="center" style="s0">
    <div>
      <p begin="00:01:57.32" id="p0" end="00:01:58.36">First caption!</p>
      <p style="s1" begin="00:02:06.52" id="p1" end="00:02:08.04">Second <span>foo</span> caption?</p>
      <p begin="00:02:08.04" id="p2" end="00:02:11.44">Ok third caption.</p>
      <p begin="00:02:11.44" id="p3" end="00:02:16.44">A what<br />oh</p>
      <p style="s1" begin="00:03:01.88" id="p14" end="00:03:04.64">AHEM: <span tts:color="white"><span>This</span> line is white<br /></span>This line is another line</p>
    </div>
  </body>
</tt>`;

test('parses styles from sample', t => {
  t.plan(1);
  const { styles } = parse(SAMPLE);
  t.deepEqual(styles, [
    {
      selector: { id: 's1' },
      properties: { color: 'yellow' },
    },
    {
      selector: { id: 's0' },
      properties: {
        backgroundColor: 'black',
        fontStyle: 'normal',
        fontSize: 16,
        fontFamily: 'sansSerif',
        color: 'white',
      },
    },
  ]);
});

test('parses a cue timestamp', t => {
  t.plan(1);
  const { blocks }  = parse(SAMPLE);
  const [cue] = blocks;
  t.deepEqual(cue.range, {
    start: {
      hours: 0, minutes: 1, seconds: 57, milliseconds: 320
    },
    end: {
      hours: 0, minutes: 1, seconds: 58, milliseconds: 360
    }
  });
});

test('parses cue text from tt sample', t => {
  t.plan(1);
  const { blocks: cues } = parse(SAMPLE);
  console.dir(cues.map(cue => cue.lines), { depth: null });

  const expected = [
    [ [ 'First caption!' ] ],
    [
      [
        'Second ',
        { tag: { type: TagType.Span }, children: [ 'foo' ] },
        ' caption?'
      ]
    ],
    [ [ 'Ok third caption.' ] ],
    [ [ 'A what' ], [ 'oh' ] ],
    [
      [
        'AHEM: ',
        {
          tag: { type: TagType.Span },
          children: [
            { tag: { type: TagType.Span }, children: [ 'This' ] },
            ' line is white'
          ]
        }
      ],
      [ { tag: { type: 3 }, children: [] }, 'This line is another line' ]
    ]
  ];

  t.deepEqual(cues.map(cue => cue.lines), expected);
});
