import { RGBColor } from './types';

const CONSTANTS: { [name: string]: RGBColor } = {
  white: {
    red: 255,
    green: 255,
    blue: 255,
    alpha: null,
  },
  yellow: {
    red: 255,
    green: 255,
    blue: 0,
    alpha: null,
  },
  cyan: {
    red: 0,
    green: 255,
    blue: 255,
    alpha: null,
  },
  lime: {
    red: 0,
    green: 255,
    blue: 0,
    alpha: null,
  }
};

export const rgbForConstant = (name: string): RGBColor => {
  const val = CONSTANTS[name];

  if (!val) {
    // throw new Error(`Missing constant: '${name}'`);
    return CONSTANTS.white;
  }

  return val;
}
