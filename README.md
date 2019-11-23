# subtitle-transform

Parses various subtitle formats (SRT/VTT/TTML/TTAF) into a type called
`SubtitleData`.

There are various generators that take `SubtitleData` and emit text
(SRT/ASS/VTT).

Text is easy, the difficult part is mapping styles.

# Usage
```
npm i
npm run build
node dist/index.js --inputFormat vtt --input the-amazing-show-ep1.vtt --outputFormat srt
```

# Progress

## Parsing
- [x] VTT parsing
  - [x] Style support
- [x] TT parsing
  - [x] Style support
- [ ] SRT parsing
  - [ ] Style support
- [ ] ASS parsing
  - [ ] Style support

## Generating
- [ ] VTT output
  - [ ] Style support
- [x] SRT output
  - [ ] Style support
- [x] ASS output
  - [ ] Style support


Resources used:
- https://www.w3.org/TR/webvtt1/#file-parsing
- https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API
- https://github.com/mozilla/vtt.js
- https://chromium.googlesource.com/chromium/blink/+/e79071b4c4e899957766312459dd4a5199bf266d/Source/core/html/track/vtt/
- https://github.com/libass/libass/blob/master/libass/ass_parse.c
- https://matroska.org/technical/specs/subtitles/ssa.html
- http://ale5000.altervista.org/subtitles.htm
- http://docs.aegisub.org/3.2/ASS_Tags/
