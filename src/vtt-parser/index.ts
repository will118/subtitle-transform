import { SubtitleData } from '../types';

import { isEOF, skipNewlines } from './utils';
import { parseHeader } from './header';
import { parseBlock } from './block';

export function parse(body: string): SubtitleData {
  const pos = { i: 0, line: 0 };
  // 4.1.1 An optional U+FEFF BYTE ORDER MARK (BOM) character.
  // 4.1.2 The string "WEBVTT".
  // 4.1.3 Optionally, either a U+0020 SPACE character or a
  //       U+0009 CHARACTER TABULATION (tab) character followed
  //       by any number of characters that are not U+000A LINE FEED (LF)
  //       or U+000D CARRIAGE RETURN (CR) characters.
  const header = parseHeader(body, pos)

  // 4.1.4 Two or more WebVTT line terminators to terminate the line with
  //       the file magic and separate it from the rest of the body.
  if (body[pos.i] == '\n') {
    skipNewlines(body, pos);
  } else {
    throw new Error('No blank line after header');
  }

  // 4.1.5 Zero or more WebVTT region definition blocks, WebVTT style blocks
  //       and WebVTT comment blocks separated from each other by one or more
  //       WebVTT line terminators.
  const styles = { styles: [] };

  // 4.1.6 Zero or more WebVTT line terminators.
  // 4.1.7 Zero or more WebVTT cue blocks and WebVTT comment blocks separated
  //       from each other by one or more WebVTT line terminators.
  // 4.1.8 Zero or more WebVTT line terminators.
  const blocks = [];

  while (!isEOF(body, pos)) {
    blocks.push(parseBlock(body, pos));
  }

  return { header, blocks, styles };
}
