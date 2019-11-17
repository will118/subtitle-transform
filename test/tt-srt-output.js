const test = require('tape')
const { parse } = require('../dist/tt-parser');
const { generate } = require('../dist/srt-generator');

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
      <p begin="00:02:11.44" id="p3" end="00:02:16.44">A what<br />oh</p>
      <p style="s1" begin="00:03:01.88" id="p14" end="00:03:04.64"><span tts:color="white"><span>This</span> line is white<br /></span>This line is something else</p>
    </div>
  </body>
</tt>`;

const EXPECTED =`1
00:01:57,320 --> 00:01:58,360
First caption!

2
00:02:11,440 --> 00:02:16,440
A what
oh

3
00:03:01,880 --> 00:03:04,640
This line is white
This line is something else
`;

test('exports expected srt from tt', t => {
  t.plan(1);
  const subData = parse(SAMPLE);
  const result = generate(subData, { enableStyles: false })
  t.equal(result, EXPECTED);
});
