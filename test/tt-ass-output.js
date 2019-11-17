const test = require('tape')
const { parse } = require('../dist/tt-parser');
const { generate } = require('../dist/ass-generator');

const SAMPLE = `<?xml version="1.0" encoding="utf-8"?> <tt xmlns="http://www.w3.org/2006/10/ttaf1" xmlns:ttp="http://www.w3.org/2006/10/ttaf1#parameter" ttp:timeBase="media" xmlns:tts="http://www.w3.org/2006/10/ttaf1#style" xml:lang="en" xmlns:ttm="http://www.w3.org/2006/10/ttaf1#metadata">
  <head>
    <!--Created on 1/11/2011 at 00:30:00-->
    <metadata>
      <ttm:title>
        Yellow eggs and potatoes
      </ttm:title>
      <ttm:copyright>
        Paul
      </ttm:copyright>
    </metadata>
    <styling>
      <style id="s0" tts:backgroundColor="black" tts:fontStyle="normal" tts:fontSize="16" tts:fontFamily="sansSerif" tts:color="white" />
      <style id="s1" style="s0" tts:color="yellow" />
    </styling>
  </head>
  <body tts:textAlign="center" style="s0">
    <div>
      <p begin="00:01:57.32" id="p0" end="00:01:58.36">First caption!</p>
      <p begin="00:02:11.44" id="p3" end="00:02:16.44">A what<br />oh</p>
      <p style="s1" begin="00:03:01.88" id="p14" end="00:03:04.64"><span tts:color="white">This line is white<br /></span>This line is something else</p>
    </div>
  </body>
</tt>`;

const EXPECTED =`[Script Info]
Title: Yellow eggs and potatoes

ScriptType: v4.00+
Collisions: Normal
PlayResX: 640
PlayResY: 360
Timer: 0.0000
WrapStyle: 0

[V4+ Styles]
Format: Name,Fontsize,PrimaryColour

Style: s0,16,&H00FFFFFF
Style: s1,,&H0000FFFF

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Text

Dialogue: 0,0:01:57.32,0:01:58.36,main,Unknown,0000,0000,0000,First caption!
Dialogue: 0,0:02:11.44,0:02:16.44,main,Unknown,0000,0000,0000,A what\\Noh
Dialogue: 0,0:03:01.88,0:03:04.64,s1,Unknown,0000,0000,0000,{\\c&HFFFFFF&}This line is white\\NThis line is something else`;

test('exports expected ass from tt', t => {
  t.plan(1);
  const subData = parse(SAMPLE);
  const result = generate(subData, { enableStyles: true })
  t.equal(result, EXPECTED);
});
