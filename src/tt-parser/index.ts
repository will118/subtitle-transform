import { SubtitleData, Block, Style } from '../types';
import { mapStyles } from './styles';
import { mapBlocks } from './blocks';
import { parseDoc } from './doc';

export function parse(body: string): SubtitleData {
  const doc = parseDoc(body);

  const header = { text: null, metadata: null };

  const blocks: Array<Block> = mapBlocks(doc);

  const styles: Array<Style> = mapStyles(doc);

  return { header, blocks, styles };
}
