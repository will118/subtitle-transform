import {
  CueLine,
  CueSettings,
  XmlElement,
  Block,
  TimestampRange,
  TagType,
} from '../types';
import { Attrs, isElem, findChild, tryStr } from './utils';

const mapRange = (attrs: Attrs): TimestampRange => {
  const begin = tryStr(attrs, 'begin');
  const end = tryStr(attrs, 'end');

  if (begin === null || end === null) {
    throw new Error('Missing timestamps on cue');
  }

  const re = /(\d\d):(\d\d):(\d\d)\.(\d\d)/;

  const beginMatch = begin.match(re);
  const endMatch = end.match(re);

  if (beginMatch === null || endMatch === null) {
    throw new Error('Invalid or unsupported timestamps on cue');
  }

  const mapMatch = (group: RegExpMatchArray) => {
    return {
      hours: parseInt(group[1], 10),
      minutes: parseInt(group[2], 10),
      seconds: parseInt(group[3], 10),
      milliseconds: parseInt(group[4], 10) * 10,
    }
  }

  return { start: mapMatch(beginMatch), end: mapMatch(endMatch) };
}

const mapLine = (children: XmlElement['children']): CueLine => {
  const line: CueLine = [];

  for (const elem of children) {
    if (!isElem(elem)) {
      // Add plain strings
      line.push(elem);
      continue;
    }

    if (elem.name === 'span') {
      // TODO: handle attrs
      line.push({
        tag: { type: TagType.Span },
        children: mapLine(elem.children),
      });

      continue;
    }

    if (elem.name !== 'br') {
      throw new Error(`Unsupported element in cue "${elem.name}"`);
    }
  }

  return line;
}

const mapBlock = (block: XmlElement): Block => {
  const settings: CueSettings = {
    vertical: null,
    line: null,
    position: null,
    size: null,
    align: null,
  }
  return {
    range: mapRange(block.attributes),
    id: block.attributes['id'] ?? null,
    lines: [mapLine(block.children)],
    settings,
  }
}

export const mapBlocks = (doc: XmlElement): Array<Block> => {
  const bodyElem = findChild(doc, 'body');

  if (bodyElem === null) {
    return [];
  }

  // TODO: check spec
  const blocksElem = findChild(bodyElem, 'div');

  if (blocksElem === null) {
    return [];
  }

  return blocksElem.children.map(block => {
    // TODO: again, check spec
    if (!isElem(block) || block.name !== 'p') {
      throw new Error('Only block elements should exist');
    }

    return mapBlock(block);
  })
}
