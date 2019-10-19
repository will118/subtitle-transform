import { SubtitleData } from '../types';

import { isEOF, skipNewlines } from './utils';
import { parseHeader } from './header';
import { parseBlock } from './block';

export function parse(body: string, _styles?: string): SubtitleData {
  const pos = { i: 0, line: 0 };

  const header = parseHeader(body, pos)

  if (body[pos.i] == '\n') {
    // Consume any extra newlines
    skipNewlines(body, pos);
  } else {
    throw new Error('No blank line after header');
  }

  const blocks = [];

  while (!isEOF(body, pos)) {
    blocks.push(parseBlock(body, pos));
  }

  return { header, blocks };
}
