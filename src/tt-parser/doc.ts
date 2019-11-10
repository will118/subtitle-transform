import sax from 'sax';
import { XmlElement, XmlRoot } from '../types';

export const parseDoc = (body: string) => {
  const parser = sax.parser(true, { trim: true });

  const root: XmlRoot = {
    parent: null,
    children: []
  }

  let current: XmlElement | XmlRoot = root;

  parser.ontext = t => {
    current.children.push(t);
  };

  parser.onopentag = ({ name, attributes, isSelfClosing }) => {
    const elem: XmlElement = {
      name,
      attributes,
      isSelfClosing,
      parent: current,
      children: [],
    }
    current.children.push(elem)
    current = elem;
  };

  parser.onclosetag = name => {
    if (current.parent !== null) {
      if (name !== current.name) {
        throw new Error('Closing tag did not match');
      }
      current = current.parent;
    }
  };


  let end = false;

  parser.onend = () => {
    end = true;
  };

  parser.onerror = e => {
    console.error(e);
  };

  parser.write(body).close();

  while (!end) {}

  // TODO: this is all a bit messy
  if (root.children.length === 1 && typeof root.children[0] !== 'string') {
    return root.children[0];
  }

  throw new Error('Failed to parse tt element')
};

