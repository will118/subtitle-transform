import {
  CueLine,
  CueSettings,
  XmlElement,
  Block,
  TimestampRange,
  TagType,
  Tag,
} from '../../types';
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

const TAG_LOOKUP = new Map<string, (e: XmlElement) => Tag>([
  ['b', _e => ({ type: TagType.Bold })],
  ['span', (e: XmlElement) => ({
    type: TagType.Span,
    styleName: e.attributes['style'] ?? null,
    properties: {},
  })],
  ['p', (e: XmlElement) => ({
    type: TagType.Span,
    styleName: e.attributes['style'] ?? null,
    properties: {},
  })],
]);

const mapLine = (children: XmlElement['children'], line: CueLine): boolean => {
  let child: string | XmlElement | undefined;

  while (child = children.shift()) {
    if (typeof child === 'string') {
      line.push(child);
      continue;
    }

    if (child.name === 'br') {
      return true;
    }

    const tagFn = TAG_LOOKUP.get(child.name);

    if (tagFn) {
      const childLine: CueLine = [];

      line.push({
        tag: tagFn(child),
        children: childLine,
      })

      const hasRemaining = mapLine(child.children, childLine);

      if (hasRemaining) {
        if (child.children.length) {
          children.unshift(child);
        }
        return true;
      }

      continue;
    }

    throw new Error('Unsupported element');
  }

  // We processed all of children without hitting a <br />
  return false;
}

const mapLines = (children: XmlElement['children']): Array<CueLine> => {
  const lines: Array<CueLine> = [[]];

  let child: string | XmlElement | undefined;

  while (child = children.shift()) {
    const currentLine = lines[lines.length - 1];

    // Handle top level strings
    if (typeof child === 'string') {
      currentLine.push(child);
      continue;
    }

    // Handle top level <br />
    if (child.name === 'br') {
      lines.push([]);
      continue;
    }

    const tagFn = TAG_LOOKUP.get(child.name);

    // Consume a tag, ideally we would recurse but it's quite tricky when we
    // come to line breaks in deeply nested tags.
    // Or maybe it's not, but this works and I have bigger fish.
    if (tagFn) {
      const line: CueLine = [];
      const hasRemaining = mapLine(child.children, line);

      currentLine.push({
        tag: tagFn(child),
        children: line,
      });

      if (hasRemaining) {
        lines.push([]);
        children.unshift(child);
      }

      continue;
    }

    throw new Error('Unsupported element');
  }

  return lines;
}


const mapBlock = (block: XmlElement): Block => {
  // TODO: these settings
  const settings: CueSettings = {
    vertical: null,
    line: null,
    position: null,
    size: null,
    align: null,
  }

  // TODO: block.attribute['style']

  return {
    lines: mapLines([block]),
    range: mapRange(block.attributes),
    id: block.attributes['id'] ?? null,
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
      throw new Error('nly block elements should exist');
    }

    return mapBlock(block);
  })
}
