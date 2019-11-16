import {
  Block, Cue, CueSettings, Timestamp, TimestampRange, Option, CueLine
} from '../types';
import { ParseFn } from './types';
import { parseCueLine } from './cue-text';
import { parseCueSettings } from './cue-settings';

import { searchLine, consumeLine, skipSpace, isEOF } from './utils';

const DIGITS = new Set([...Array(10).keys()].map((x: number) => x.toString()));

const isDigit = (char: string) => DIGITS.has(char);

type DigitParseResult = { count: number, value: number };

const consumeDigits: ParseFn<DigitParseResult> = (body, pos) => {
  let digits = '';

  while (isDigit(body[pos.i])) {
    digits += body[pos.i++];
  }

  return {
    value: parseInt(digits, 10),
    count: digits.length
  }
}

const parseTimestamp: ParseFn<Option<Timestamp>> = (body, pos) => {
  const result = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  };

  const a = consumeDigits(body, pos);

  if (a.count === 0) {
    return null;
  }

  // If not 2 characters or value is greater than 59, interpret as hours.
  const isHours = a.count != 2 || a.value > 59;

  if (body[pos.i] !== ':') {
    return null;
  }

  pos.i++;

  const b = consumeDigits(body, pos);

  if (b.count !== 2) {
    return null;
  }

  // Either we know we are hours, or we check.
  if (isHours || body[pos.i] == ':') {
    if (body[pos.i] == ':') pos.i++;

    const c = consumeDigits(body, pos);

    if (c.count !== 2) {
      return null;
    }

    result.hours = a.value;
    result.minutes = b.value;
    result.seconds = c.value;
  } else {
    result.hours = 0;
    result.minutes = a.value;
    result.seconds = b.value;
  }

  if (result.minutes > 59 || result.seconds > 59) {
    return null;
  }

  if (body[pos.i] !== '.') {
    return null;
  } else {
    pos.i++;
  }

  const d = consumeDigits(body, pos);

  if (d.count !== 3) {
    return null;
  }

  result.milliseconds = d.value;

  return result;
};

const parseTimestamps: ParseFn<Option<TimestampRange>> = (body, pos) => {
  skipSpace(body, pos);

  const start = parseTimestamp(body, pos);


  if (start === null) {
    return null;
  }

  skipSpace(body, pos);

  if (body.slice(pos.i, pos.i + 3) !== '-->') {
    return null;
  } else {
    pos.i += 4;
  }

  const end = parseTimestamp(body, pos);

  if (end === null) {
    return null;
  }

  return { start, end };
}

const parseCueText: ParseFn<Array<CueLine>> = (body, pos) => {
  const results: Array<CueLine> = [];

  while (!isEOF(body, pos)) {
    const line = consumeLine(body, pos)
    if (line) {
      results.push(parseCueLine(line));
    } else {
      pos.i++;
      if (body[pos.i] === '\n') {
        break;
      }
    }
  }

  return results;
}

const parseCue: ParseFn<Cue> = (body, pos) => {
  const containsTs = searchLine('-->')

  let id: Option<string> = null;
  let range: Option<TimestampRange> = null;
  let settings: Option<CueSettings> = null;
  let lines: Array<CueLine> = [];
  let inCue = false;

  while (!isEOF(body, pos)) {
    if (body[pos.i] === '\n') {
      // empty line
      pos.i++;
    } else {
      if (containsTs(body, pos)) {
        range = parseTimestamps(body, pos);
        settings = parseCueSettings(body, pos);
        inCue = true;
      } else if (inCue) {
        lines = parseCueText(body, pos);
        break;
      } else {
        id = consumeLine(body, pos);
      }
    }
  }

  if (range == null || settings == null) {
    throw new Error('Failed to parse');
  }

  return { id, range, lines, settings };
}

export const parseBlock: ParseFn<Block> = (body, pos) => {
  return parseCue(body, pos);
};
