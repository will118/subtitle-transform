# subtitle-transform

* Parse TT/VTT files and output SRT or ASS.
  * SRT is a very limited format so retains only timings and text.
  * ASS should retain most of the styling.

# Usage
```
node dist/index.js --inputFormat vtt --input the-amazing-show-ep1.vtt --outputFormat srt
```

# Progress


- [x] VTT parsing
  - [x] Style support
- [x] TT parsing
- [ ] SRT parsing
- [ ] ASS parsing
- [ ] VTT output
- [x] SRT output
  - [ ] Tag support
- [ ] ASS output

WARNING: I vary between reading specs and reference implementations in depth to
hacking stuff that will work on the 1 or 2 samples files I am using.

# Not really on my list

- VTT external style files (should be easy though)

Resources used:
- https://www.w3.org/TR/webvtt1/#file-parsing
- https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API
- https://github.com/mozilla/vtt.js
- https://chromium.googlesource.com/chromium/blink/+/e79071b4c4e899957766312459dd4a5199bf266d/Source/core/html/track/vtt/
- https://github.com/libass/libass/blob/master/libass/ass_parse.c
- https://matroska.org/technical/specs/subtitles/ssa.html
- http://ale5000.altervista.org/subtitles.htm
