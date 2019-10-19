import { Header, Metadata } from '../types';
import { ParseFn } from './types';

import { consumeLine } from './utils';

const FILE_HEADER = 'WEBVTT';

const consumeHeaderMetadata: ParseFn<Array<Metadata> | null> = (_body, _pos) => {
  return null;
}

export const parseHeader: ParseFn<Header> = (body, pos) => {
  // 6.1
  // https://www.w3.org/TR/webvtt1/#file-parsing
  if (body.slice(pos.i, pos.i + FILE_HEADER.length) == FILE_HEADER) {
    pos.i = FILE_HEADER.length;

    switch (body[pos.i]) {
      case ' ':
        pos.i++;
        break;
      case '\t':
        pos.i++;
        break;
      case '\n':
        pos.i++;
        break;
      default:
        throw new Error('Header not followed by \\t, \\n or space char.');
    }

    // Either the header text or null
    const text = consumeLine(body, pos);

    if (text && text.includes('-->')) {
      throw new Error('Arrow in header text');
    }

    // TODO: header metadata support
    const metadata = consumeHeaderMetadata(body, pos);

    return { text, metadata };
  }

  throw new Error('Invalid header');
};
