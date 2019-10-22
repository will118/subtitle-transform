import { Block, Cue, Timestamp, SubtitleData } from './types';

const isCue = (block: Block): block is Cue => 'range' in block;

const ts = (ts: Timestamp) => {
  const pad = (n: number, width: number) => String(n).padStart(width, '0')

  const h = pad(ts.hours, 2);
  const m = pad(ts.minutes, 2);
  const s = pad(ts.seconds, 2);
  const ms = pad(ts.milliseconds, 3);

  return `${h}:${m}:${s},${ms}`;
}

function generate(sub: SubtitleData) {
  let output = '';
  let index = 1;

  for (const block of sub.blocks) {
    if (output) {
      output += '\n';
    }

    if (isCue(block)) {
      output += `${index++}\n`;
      output += `${ts(block.range.start)} --> ${ts(block.range.end)}`;
      for (const line of block.lines) {
        output += line.children[0]
      }
    }
  }
  return output;
}

export { generate };
