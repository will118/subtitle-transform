import { CueElement, CueLine, Tag, TagType } from '../types';

const tagForStr = (str: string): Tag & { closing: boolean } => {
  const closing = str[0] === '/';

  const tag = closing ? str.substring(1) : str;

  switch (tag) {
    case 'i':
      return { closing, type: TagType.Italic };
    case 'b':
      return { closing, type: TagType.Bold };
    default:
      break;
  }

  if (tag[0] === 'c') {
    if (tag.length === 1) {
      return {
        closing,
        type: TagType.Class,
        className: ''
      }
    }
    if (tag[1] === '.') {
      return {
        closing,
        type: TagType.Class,
        className: tag.substring(2)
      }
    }
  }

  throw new Error('Tag not supported or some other error: ' + str);
}

const parse = (pos: { i: number }, line: string): CueElement['children'] => {
  enum State { Normal, Tag }

  let str = '';
  let state = State.Normal;

  const children: CueElement['children'] = []

  while (pos.i < line.length) {
    const char = line[pos.i];
    pos.i++;

    if (state === State.Tag && char === "/") {
      str += char;
      continue;
    }

    if (char === '<') {
      if (str) {
        children.push(str)
        str = '';
      }
      state = State.Tag;
    } else if (char === '>') {
      const { closing, ...tag } = tagForStr(str);
      str = '';
      if (closing) {
        break;
      }
      children.push({ tag, children: parse(pos, line) });
      state = State.Normal;
    } else {
      str += char;
    }
  }

  if (str) {
    children.push(str);
  }

  return children;
}

export const parseCueLine = (line: string): CueLine => {
  let pos = { i: 0 };

  return {
    children: parse(pos, line),
  };
};
