import { Option, Style, StyleProperties, StyleProperty, Selector } from '../types';
import { ParseFn } from './types';
import { isEOF, match, consumeLine, parsePercentage } from './utils';

const parseSelector = (selector: string): Selector => {
  if (selector.startsWith('.')) {
    return { class: selector.substring(1) };
  }

  if (selector.startsWith('#')) {
    return { id: selector.substring(1) };
  }

  return { element: selector };
}

const parseProperty = (name: string, value: string): StyleProperty => {
  switch (name) {
    case 'color':
      return { color: value }
    case 'opacity':
      if (value.endsWith('%')) {
        return { opacity: parsePercentage(value) }
      } else {
        const float = parseFloat(value)
        if (float < 0 || float > 1) {
          throw new Error('Invalid alpha value');
        }
        return { opacity: float };
      }
    default:
      throw new Error(`Unknown style property "${name}"`);
  }
}

const parseStyle: ParseFn<Option<Style>> = (body, pos) => {
  if (!match('::cue(')(body, pos)) {
    return null
  }

  let selector = '';
  const properties: StyleProperties = {};

  enum State { None, Selector, PropertyName, PropertyValue };
  let state = State.Selector;

  let propertyName = '';
  let propertyValue = '';

  while (!isEOF(body, pos)) {
    const char = body[pos.i];

    if (char === '\n') {
      if (state === State.PropertyName) {
        pos.i++;
        continue;
      }
      throw new Error('Failed to handle newline in style');
    }

    if (state === State.Selector) {
      if (char === ')') {
        state = State.None;
      } else {
        selector += char;
      }
      pos.i++;
      continue;
    }

    // Otherwise we are collecting properties
    if (char === '}') {
      pos.i++;
      break;
    }

    if (char === '{') {
      state = State.PropertyName;
      pos.i++;
      continue;
    }

    if (char === ' ') {
      pos.i++;
      continue;
    }

    if (state === State.PropertyName) {
      if (char === ':') {
        state = State.PropertyValue;
        pos.i++;
        continue;
      } else {
        propertyName += char;
      }
    }

    if (state === State.PropertyValue) {
      if (char === ';') {
        const property = parseProperty(propertyName, propertyValue);
        Object.assign(properties, property);
        state = State.PropertyName;
        propertyName = '';
        propertyValue = '';
      } else {
        propertyValue += char;
      }
    }

    pos.i++;
  }

  return { selector: parseSelector(selector), properties }
};

export const parseRegions: ParseFn<Array<Style>> = (body, pos) => {
  const styles: Array<Style> = [];

  while (!isEOF(body, pos)) {
    const char = body[pos.i];
    if (char === '\n') {
      pos.i++;
    } else if (char === ':') {
      // There should be a STYLE header, there isn't always in The Real World.
      const style = parseStyle(body, pos)
      if (style === null) {
        throw new Error('Unable to parse style');
      }
      styles.push(style);
    } else if (char === 'N') {
      // NOTE region, problematic because there might not be a STYLE
      consumeLine(body, pos);
    } else {
      // don't increment position
      break;
    }
  }

  return styles;
};
