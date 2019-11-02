# vtt-transform

* Parse VTT files and output SRT or ASS.
  * SRT is a very limited format so retains only timings and text.
  * ASS should retain most of the styling.

# Progress

- [x] Basic VTT parsing
  - [x] Style support
- [ ] VTT output
- [ ] SRT parsing
- [x] SRT output
- [ ] ASS parsing
- [ ] ASS output

# Not really on my list

- External style files (should be easy though)

Resources used:
- https://www.w3.org/TR/webvtt1/#file-parsing
- https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API
- https://github.com/mozilla/vtt.js
- https://chromium.googlesource.com/chromium/blink/+/e79071b4c4e899957766312459dd4a5199bf266d/Source/core/html/track/vtt/
- https://github.com/libass/libass/blob/master/libass/ass_parse.c
- https://matroska.org/technical/specs/subtitles/ssa.html
