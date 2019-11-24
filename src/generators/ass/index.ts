import {
  Cue,
  CueLine,
  GeneratorFn,
  GeneratorOpts,
  SubtitleData,
  Block,
  Style,
  TagType,
  StyleProperties,
  Timestamp,
} from '../../types';
import { rgbForConstant } from '../../colors';
import { isCue, isDefined } from '../../utils';

const infoRegion = (title: string) => `[Script Info]
Title: ${title}

ScriptType: v4.00+
Collisions: Normal
PlayResX: 640
PlayResY: 360
Timer: 0.0000
WrapStyle: 0`;

type FormatFn = (properties: StyleProperties) => string | null

// TODO: Tree shaking of unused styles
const stylesRegion = (styles: Array<Style>): string => {
  const FORMAT = new Map<string, FormatFn>([
    [
      'Fontsize',
      properties => {
        const val = properties.fontSize;
        if (typeof val === 'number') {
          return `${val}`;
        }
        return null;
      }
    ],
    [
      'PrimaryColour',
      properties => {
        const val = properties.color;

        if (!isDefined(val)) {
          return null;
        }

        if (typeof val === 'string') {
          const rgb = rgbForConstant(val);
          const f = (num: number) => num.toString(16).padStart(2, '0').toUpperCase();
          return `&H00${f(rgb.blue)}${f(rgb.green)}${f(rgb.red)}`;
        }

        if ('hex' in val) {
          return `${val}`;
        }

        return null;
      }
    ],
  ]);

  let output = '[V4+ Styles]';

  output += `\nFormat: Name,${[...FORMAT.keys()].join(',')}\n`

  for (const style of styles) {
    output += '\nStyle: ';

    if ('id' in style.selector) {
      output += style.selector.id
    } else {
      throw new Error('Selector not implemented');
    }

    for (const formatFn of FORMAT.values()) {
      output += ',';
      const formatted = formatFn(style.properties);
      if (formatted !== null) {
        output += formatted;
      }
    }
  }

  return output;
}

type CueFn = (cue: Cue) => string | null

const ts = (ts: Timestamp, skew: number) => {
  const pad = (n: number, width: number) => String(n).padStart(width, '0')

  const skewed = ts.seconds + skew;

  const h = ts.hours;
  // TODO: negative skew
  const m = pad(skewed > 59 ? ts.minutes + 1 : ts.minutes, 2);
  const s = pad(skewed % 59, 2);
  const ms = pad(ts.milliseconds, 3).substring(0, 2);

  return `${h}:${m}:${s}.${ms}`;
}

const line = (lines: Array<CueLine>): string | null => {
  // TODO: inline styles
  const reduce = (cueLine: CueLine): string => {
    let output = '';
    for (const child of cueLine) {
      if (typeof child === 'string') {
        output += child;
      } else {
        const contents = reduce(child.children);
        // TODO: we don't want to create unnecessary styles (i.e. the default)
        if (child.tag.type === TagType.Span && child.tag.styleName !== null) {
            // && parentStyle !== null && parentStyle !== child.tag.styleName) {
          output += `{\\r${child.tag.styleName}}`;
          output += contents;
          output += '{\\r}'
        } else {
          output += contents;
        }
      }
    }
    return output;
  };

  return lines.map(reduce).join('\\N');
};

const blockRegion = (blocks: Array<Block>, opts: GeneratorOpts): string => {
  const FORMAT = new Map<string, CueFn>([
    [
      'Layer',
      () => '0'
    ],
    [
      'Start',
      cue => ts(cue.range.start, opts.timestampSkew)
    ],
    [
      'End',
      cue => ts(cue.range.end, opts.timestampSkew)
    ],
    [
      'Style',
      cue => {
        let style = null
        // We are going to fold all the lines together into one ASS line.
        // Inline styles are used for nested spans, but we can create more
        // readable ASS files if we use a style for the whole line.
        //
        // So let's check the outer style of each element on each line.
        // TODO: double check this
        for (const line of cue.lines) {
          for (const elem of line) {
            if (typeof elem !== 'string') {
              if (elem.tag.type === TagType.Span) {
                if (style === null) {
                  style = elem.tag.styleName;
                } else {
                  if (style !== elem.tag.styleName) {
                    return 'main';
                  }
                }
              }
            }
          }
        }
        return style ?? 'main';
      }
    ],
    [
      'Name',
      () => 'Unknown'
    ],
    [
      'MarginL',
      () => '0000'
    ],
    [
      'MarginR',
      () => '0000'
    ],
    [
      'MarginV',
      () => '0000'
    ],
    [
      'Text',
      cue => line(cue.lines)
    ],
  ]);

  let output = '[Events]';

  output += `\nFormat: ${[...FORMAT.keys()].join(',')}\n`

  for (const block of blocks) {
    if (isCue(block)) {
      output += '\nDialogue: ';
      output += [...FORMAT.values()].map(fn => fn(block)).join(',');
    }
  }

  return output;
}

export const generate: GeneratorFn = (
  sub: SubtitleData,
  opts: GeneratorOpts
) => {
  if (!opts.enableStyles) {
    throw new Error('Unstyled ASS not currently supported');
  }

  let output = '';

  output += infoRegion(sub.header.text ?? 'Unknown file');
  output += '\n\n';
  output += stylesRegion(sub.styles);
  output += '\n\n';
  output += blockRegion(sub.blocks, opts);

  return output;
}
