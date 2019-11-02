import { ParseFn, Position } from './types';
import { Percentage } from '../types';

export const isEOF: ParseFn<boolean> = (body, pos) => pos.i >= body.length

const SPACE_CHARACTERS = new Set([' ', '\t', '\n', '\f', '\r']);

const consume = (body: string, pos: Position, f: ParseFn<boolean>) => {
  let text = '';
  while (!isEOF(body, pos) && f(body, pos)) {
    text += body[pos.i++]
  }
  return text || null;
}

export const skipSpace: ParseFn<void> = (body, pos) => {
  while (body[pos.i] == ' ') { pos.i++; }
};

export const skipWhitespace: ParseFn<void> = (body, pos) => {
  consume(body, pos, (body, pos) => SPACE_CHARACTERS.has((body[pos.i])));
};

export const skipNewlines: ParseFn<void> = (body, pos) => {
  while (body[pos.i] == '\n') { pos.i++; }
}

export const match: (str: string) => ParseFn<boolean> = (str: string) =>
  (body, pos) => {
    let i = 0;
    let end = str.length;

    while (!isEOF(body, pos) && i < end) {
      if (str[i] !== body[pos.i]) {
        return false;
      }
      i++;
      pos.i++;
    }

    return true;
  }

export const consumeLine: ParseFn<string | null> = (body, pos) => {
  return consume(body, pos, (body, pos) => body[pos.i] !== '\n');
};

export const searchLine: (str: string) => ParseFn<boolean> = str =>
  (body, pos) => {
    const nextNewline = body.indexOf('\n', pos.i)
    if (nextNewline <= pos.i) {
      return false;
    }
    return body.slice(pos.i, nextNewline).includes(str);
  };

export const parsePercentage = (value: string): Percentage => ({
  value: parseInt(value.slice(0, -1), 10)
});
