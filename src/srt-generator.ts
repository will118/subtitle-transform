import {
  CueLine,
  Timestamp,
  TagType,
  SubtitleData,
  GeneratorFn,
  GeneratorOpts,
} from './types';
import { isCue } from './utils';


const ts = (ts: Timestamp) => {
  const pad = (n: number, width: number) => String(n).padStart(width, '0')

  const h = pad(ts.hours, 2);
  const m = pad(ts.minutes, 2);
  const s = pad(ts.seconds, 2);
  const ms = pad(ts.milliseconds, 3);

  return `${h}:${m}:${s},${ms}`;
}

const withStyling = (tagType: TagType, contents: string): string => {
  switch (tagType) {
    case TagType.Bold:
      return `<b>${contents}</b>`;
    case TagType.Italic:
      return `<i>${contents}</i>`;
    default:
      return contents;
  }
}

const formatCueLine = (lines: CueLine, enableStyles: boolean): string => {
  let output = ''

  for (const elem of lines) {
    if (typeof elem === 'string') {
      output += `${elem}`;
    } else if (Array.isArray(elem)) {
      throw new Error('Not implemented');
    } else {
      const contents = formatCueLine(elem.children, enableStyles);
      output += enableStyles
        ? withStyling(elem.tag.type, contents)
        : contents;
    }
  }

  return output;
}

export const generate: GeneratorFn = (
  sub: SubtitleData,
  opts: GeneratorOpts
) => {
  if (opts.enableStyles) {
    throw new Error('Not currently supported');
  }

  let output = '';
  let index = 1;

  for (const block of sub.blocks) {
    if (output) {
      output += '\n';
    }

    if (isCue(block)) {
      output += `${index++}\n`;
      output += `${ts(block.range.start)} --> ${ts(block.range.end)}\n`;
      for (const line of block.lines) {
        output += formatCueLine(line, opts.enableStyles);
        output += '\n';
      }
    }
  }

  return output;
}
