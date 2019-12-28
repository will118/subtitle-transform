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
// Defaults taken from:
// https://github.com/libass/libass/blob/be0d1613f79a95073d18d96a60e1394abf9316a2/libass/ass.c#L200-L224
const stylesRegion = (styles: Array<Style>): string => {
  const FORMAT = new Map<string, FormatFn>([
    [
      'Fontname',
      properties => {
        return properties.fontFamily ?? 'Arial';
      }
    ],
    [
      'Fontsize',
      properties => {
        const val = properties.fontSize;
        if (typeof val === 'number') {
          return `${val}`;
        }
        return '18';
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
          throw new Error('Hex not supported');
        }

        return '&H00FFFFFF';
      }
    ],
    [
      'SecondaryColour',
      _properties => {
        return '&H0000FFFF';
      }
    ],
    [
      'OutlineColour',
      _properties => {
        return '&H00000000';
      }
    ],
    [
      'BackColour',
      _properties => {
        return '&H80000000';
      }
    ],
    [
      'Bold',
      _properties => {
        return '200';
      }
    ],
    [
      'ScaleX',
      _properties => {
        return '100';
      }
    ],
    [
      'ScaleY',
      _properties => {
        return '100';
      }
    ],
    [
      'Spacing',
      _properties => {
        return '0';
      }
    ],
    [
      'BorderStyle',
      _properties => {
        return '1';
      }
    ],
    [
      'Outline',
      _properties => {
        return '2';
      }
    ],
    [
      'Shadow',
      _properties => {
        return '0';
      }
    ],
    [
      'Alignment',
      _properties => {
        return '2';
      }
    ],
    [
      'MarginL',
      _properties => {
        return '0020';
      }
    ],
    [
      'MarginR',
      _properties => {
        return '0020';
      }
    ],
    [
      'MarginV',
      _properties => {
        return '0020';
      }
    ],
  ]);

  let output = '[V4+ Styles]';

  output += `\nFormat: Name,${[...FORMAT.keys()].join(',')}\n`;

  const defaultStyle = {
    color: 'white'
  };
  output += '\nStyle: Default,';
  output += [...FORMAT.values()].map(fn => fn(defaultStyle)).join(',');

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

const ts = (ts: Timestamp) => {
  const pad = (n: number, width: number) => String(n).padStart(width, '0')

  const h = ts.hours;
  const m = pad(ts.minutes, 2);
  const s = pad(ts.seconds, 2);
  const ms = pad(ts.milliseconds, 3).substring(0, 2);

  return `${h}:${m}:${s}.${ms}`;
}

const line = (lines: Array<CueLine>, parentStyle: string | null): string | null => {
  // TODO: inline styles
  const reduce = (cueLine: CueLine): string => {
    let output = '';
    for (const child of cueLine) {
      if (typeof child === 'string') {
        output += child;
      } else {
        const contents = reduce(child.children);
        // TODO: this is a bit grim
        if (child.tag.type === TagType.Span && child.tag.styleName !== null
            && parentStyle !== null && parentStyle !== child.tag.styleName) {
          output += `{\\r${child.tag.styleName}}`;
          output += contents;
          output += '{\\r}'
        } else if (child.tag.type === TagType.Span && Object.keys(child.tag.properties).length) {
          if (Object.keys(child.tag.properties).length !== 1) {
            throw new Error('Unsupported style property');
          }

          if (!('color' in child.tag.properties)) {
            throw new Error('Only color supported');
          }

          if (typeof child.tag.properties.color === 'string') {
            const rgb = rgbForConstant(child.tag.properties.color);
            const f = (num: number) => num.toString(16).padStart(2, '0').toUpperCase();
            const color = `${f(rgb.blue)}${f(rgb.green)}${f(rgb.red)}`;

            output += `{\\c&H${color}&}`;
            output += contents;
            output += '{\\r}'
          } else {
            throw new Error('Not implemented either');
          }
        } else {
          output += contents;
        }
      }
    }
    return output;
  };

  return lines.map(reduce).join('\\N');
};

const blockRegion = (blocks: Array<Block>): string => {
  // TODO: global that relies on ordering of array.
  // Fix this atrocity.
  let style: string | null = null

  const FORMAT = new Map<string, CueFn>([
    [
      'Layer',
      () => '0'
    ],
    [
      'Start',
      cue => ts(cue.range.start)
    ],
    [
      'End',
      cue => ts(cue.range.end)
    ],
    [
      'Style',
      cue => {
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
                    return 'Default';
                  }
                }
              }
            }
          }
        }
        return style ?? 'Default';
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
      cue => line(cue.lines, style)
    ],
  ]);

  let output = '[Events]';

  output += `\nFormat: ${[...FORMAT.keys()].join(',')}\n`

  for (const block of blocks) {
    // TODO: fix this global
    style = null;
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
  output += blockRegion(sub.blocks);

  return output;
}
