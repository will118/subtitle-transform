# subtitle-transform

Parses various subtitle formats (VTT/TTML/TTAF) into a type called `SubtitleData`.

There are various generators that take `SubtitleData` and emit text (SRT/ASS).

Text is easy, the difficult part is mapping styles.

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
```
import { parseTT, generateASS } from 'subtitle-transform';

const subtitleData = parse(inputContents, {});
const output = generate(subtitleData, { enableStyles: true });

console.log(output);
```

# Progress

## Parsing
- [x] VTT parsing
  - [x] Style support
- [x] TT parsing
  - [x] Style support

## Generating
- [x] SRT output
  - [x] Style support
- [x] ASS output
  - [x] Style support
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
