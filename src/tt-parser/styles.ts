import { XmlElement, Style, StyleProperties } from '../types';
import { Attrs, isElem, findChild, tryInt, tryStr } from './utils';

const mapStyle = (attrs: Attrs) => {
  const properties: StyleProperties = {};

  const fontSize = tryInt(attrs, 'tts:fontSize');
  if (fontSize !== null) {
    properties['fontSize'] = fontSize;
  }

  const fontStyle = tryStr(attrs, 'tts:fontStyle');
  if (fontStyle !== null) {
    properties['fontStyle'] = fontStyle;
  }

  const fontFamily = tryStr(attrs, 'tts:fontFamily');
  if (fontFamily !== null) {
    properties['fontFamily'] = fontFamily;
  }

  const color = tryStr(attrs, 'tts:color');
  if (color !== null) {
    properties['color'] = color;
  }

  const bgColor = tryStr(attrs, 'tts:backgroundColor');
  if (bgColor !== null) {
    properties['backgroundColor'] = bgColor;
  }

  return {
    selector: { id: attrs['id'] },
    properties,
  }
}

export const mapStyles = (doc: XmlElement): Array<Style> => {
  const headElem = findChild(doc, 'head');

  if (headElem === null) {
    return [];
  }

  const stylesElem = findChild(headElem, 'styling');

  if (stylesElem === null) {
    return [];
  }

  return stylesElem.children.map(style => {
    if (!isElem(style)) {
      throw new Error('Only style elements should exist');
    }
    return mapStyle(style.attributes);
  })
}
