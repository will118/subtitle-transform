import { Block, Cue, CueLine, Timestamp, TagType, SubtitleData } from './types';

const isCue = (block: Block): block is Cue => 'range' in block;

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

function generate(sub: SubtitleData, enableStyles: boolean = false) {
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
        output += formatCueLine(line, enableStyles);
        output += '\n';
      }
    }
  }

  return output;
}

export { generate };
