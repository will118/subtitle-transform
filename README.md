# subtitle-transform

Parses various subtitle formats (VTT/TTML/TTAF) into a type called `SubtitleData`.

There are various generators that take `SubtitleData` and emit text (SRT/ASS).

# Usage

### CLI
```
npm i -g subtitle-transform
```
With a file:
```
subtitle-transform --input=ep1.vtt --inputFormat=vtt --outputFormat=ass
```
or pipe:
```
cat ep1.vtt | subtitle-transform --inputFormat=vtt --outputFormat=ass
```

You can also pass `--timestampSkew=-2.1` to adjust timestamps.

### Library
```
npm i -S subtitle-transform
```
```typescript
import { parseTT, generateASS } from 'subtitle-transform';

const inputContents = `<?xml version="1.0" encoding="utf-8"?>
  <tt xmlns="http://www.w3.org/2006/10/ttaf1" xml:lang="en" xmlns:ttm="http://www.w3.org/2006/10/ttaf1#metadata">
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

const subtitleData = parseTT(inputContents, {});
const output = generateASS(subtitleData, { enableStyles: true });

console.log(output);
```

# Progress

## Parsing
- [x] VTT parsing
  - [x] Style support
- [x] TT parsing
  - [x] Style support
- [ ] ASS parsing
  - [ ] Style support

## Generating
- [x] SRT output
  - [x] Style support
- [x] ASS output
  - [x] Style support
  - [ ] Region support
- [ ] VTT output
  - [ ] Style support
  - [ ] Region support

Resources used:
- https://www.w3.org/TR/webvtt1/#file-parsing
- https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API
- https://github.com/mozilla/vtt.js
- https://chromium.googlesource.com/chromium/blink/+/e79071b4c4e899957766312459dd4a5199bf266d/Source/core/html/track/vtt/
- https://github.com/libass/libass/blob/master/libass/ass_parse.c
- https://matroska.org/technical/specs/subtitles/ssa.html
- http://ale5000.altervista.org/subtitles.htm
- http://docs.aegisub.org/3.2/ASS_Tags/
