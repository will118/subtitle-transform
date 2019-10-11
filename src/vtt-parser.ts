import { SubtitleData, Header, Cue } from './types';

type Position = { i: number, line: number }

type ParseFn<T> = (body: string, pos: Position) => T

const isEOF: ParseFn<boolean> = (body, pos) => pos.i == body.length

const parseWhitespace: ParseFn<void> = (body, pos) => {
  for (; pos.i < body.length; pos.i++) {
      switch(body[pos.i]) {
        case ' ':
        case '\r':
        case '\t':
        case '\n':
          pos.line++;
          break;
        default:
          return;
      }
  }
};

const consumeLine: ParseFn<string> = (body, pos) => {
  let text = '';
  while (body[pos.i] != '\n' && !isEOF(body, pos)) {
    text += body[pos.i++]
  }
  if (text.includes('-->')) {
    throw new Error('arrow in header text');
  }
  return text;
};

const parseHeader: ParseFn<Header> = (body, pos) => {
  const header = 'WEBVTT';

  parseWhitespace(body, pos);

  if (body.slice(pos.i, pos.i + header.length) == header) {
    pos.i += header.length;

    if (body[pos.i] == '\n') {
      pos.line++;
      return { text: null };
    }

    if (isEOF(body, pos)) {
      return { text: null };
    }

    if (body[pos.i] == ' ') {
      pos.i++;
      return { text: consumeLine(body, pos) }
    }
  }

  throw new Error('header');
};

// const isDigit = (char: string) => char >= '0' && char <= '9';

const parseCue: ParseFn<Cue> = (_body, pos) => {
  pos.i++;

  return {
    id: '12',
    start: {
      hours: 0,
      minutes: 0,
      seconds: 0
    },
    end: {
      hours: 0,
      minutes: 0,
      seconds: 0
    },
    lines: []
  }
};

// TODO: ordering of big CSS file?
function parse(body: string, _styles?: string): SubtitleData {
  const pos = { i: 0, line: 0 };

  const header = parseHeader(body, pos)

  if (body[pos.i] == '\n' && body[pos.i + 1] == '\n') {
    parseWhitespace(body, pos)
  } else if (!isEOF(body, pos)) {
    throw new Error('no blank line after header');
  }

  const cues = [];

  while (!isEOF(body, pos)) {
    cues.push(parseCue(body, pos));
  }

  return {
    header,
    cues
  };
}

export { parse };
