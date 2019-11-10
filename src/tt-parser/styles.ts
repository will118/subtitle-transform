import { XmlElement, Style, StyleProperties, Option } from '../types';

const isElem = (elem: XmlElement | string): elem is XmlElement =>
  typeof elem !== 'string';

const findChild = (elem: XmlElement | string, name: string): XmlElement => {
  if (!isElem(elem)) {
    throw new Error('Must be Element');
  }

  const child = elem.children.find(x => isElem(x) && x.name === name);
  return child as XmlElement
}

type Attrs = { [name: string]: string }

const tryInt = (attrs: Attrs, name: string): Option<number> => {
  if (name in attrs) {
    return parseInt(attrs[name], 10);
  }
  return null;
}

const tryStr = (attrs: Attrs, name: string): Option<string> => {
  if (name in attrs) {
    return attrs[name];
  }
  return null;
}

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
