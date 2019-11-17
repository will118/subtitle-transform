import { XmlElement, Header } from '../types';
import { isElem, findChild } from './utils';

export const mapHeader = (doc: XmlElement): Header => {
  const headElem = findChild(doc, 'head');

  const header: Header = { text: null, metadata: null };

  if (headElem === null) {
    return header;
  }

  const metadataElem = findChild(headElem, 'metadata');

  if (metadataElem === null) {
    return header;
  }

  for (const elem of metadataElem.children) {
    if (!isElem(elem)) {
      throw new Error('Only style elements should exist');
    }
    if (elem.name === 'ttm:title') {
      const [value, ...rest] = elem.children;
      if (rest.length) throw new Error('Invalid title');
      if (typeof value !== 'string') throw new Error('Invalid title');
      header.text = value.trim();
    }
  }

  return header;
}
