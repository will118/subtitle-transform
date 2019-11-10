import { XmlElement, Option } from '../types';

export const isElem = (elem: XmlElement | string): elem is XmlElement =>
  typeof elem !== 'string';

export const findChild = (elem: XmlElement | string, name: string): XmlElement => {
  if (!isElem(elem)) {
    throw new Error('Must be Element');
  }

  const child = elem.children.find(x => isElem(x) && x.name === name);
  return child as XmlElement
}

// TODO: types.ts?
export type Attrs = { [name: string]: string }

export const tryInt = (attrs: Attrs, name: string): Option<number> => {
  if (name in attrs) {
    return parseInt(attrs[name], 10);
  }
  return null;
}

export const tryStr = (attrs: Attrs, name: string): Option<string> => {
  if (name in attrs) {
    return attrs[name];
  }
  return null;
}
