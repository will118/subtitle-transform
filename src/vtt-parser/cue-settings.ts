import { CueSetting, CueSettings } from '../types';
import { ParseFn } from './types';
import { isEOF, parsePercentage } from './utils';

const parseSettingKey = (key: string, value: string): CueSetting  => {
  switch (key) {
    case 'line':
      if (value.endsWith('%')) {
        return { line: parsePercentage(value) }
      } else {
        return { line: parseInt(value, 10) };
      }
    case 'position':
      if (value.endsWith('%')) {
        return { position: parsePercentage(value) }
      }
      throw new Error(`Position must be percentage "${value}"`);
    case 'align':
      if (value === 'start' || value === 'middle' || value === 'end') {
        return { align: value }
      }
      throw new Error(`Align must be 'start', 'middle', 'end' "${value}"`);
    default:
      throw new Error(`Unknown cue setting "${key}"`);
  }
}

export const parseCueSettings: ParseFn<CueSettings> = (body, pos) => {
  const settings: CueSettings = {
    vertical: null,
    line: null,
    position: null,
    size: null,
    align: null,
  }

  let isCollectingKey = true;
  let key = '';
  let value = '';

  while (!isEOF(body, pos)) {
    const char = body[pos.i];
    pos.i++;

    // check key has value to skip the leading spaces
    if (!key && char === ' ') {
      continue;
    }

    if (char === ':') {
      isCollectingKey = false;
      continue;
    }

    if (char === '\n') {
      if (key && value) {
        const setting = parseSettingKey(key, value);
        Object.assign(settings, setting);
      }
      return settings;
    }

    if (char === ' ') {
      isCollectingKey = true;
      const setting = parseSettingKey(key, value);
      Object.assign(settings, setting);
      key = '';
      value = '';
      continue;
    }

    if (isCollectingKey) {
      key += char;
    } else {
      value += char;
    }
  }

  return settings;
};
