import { SubtitleData, Block, Style } from '../types';
import { mapStyles } from './styles';
import { parseDoc } from './doc';

export function parse(body: string): SubtitleData {
  const doc = parseDoc(body);

  const header = { text: null, metadata: null };

  const blocks: Array<Block> = [];

  const styles: Array<Style> = mapStyles(doc);

  return { header, blocks, styles };
}
