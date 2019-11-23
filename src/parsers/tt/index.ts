import { SubtitleData, Header, Block, Style } from '../../types';
import { mapHeader } from './header';
import { mapStyles } from './styles';
import { mapBlocks } from './blocks';
import { parseDoc } from './doc';

export function parse(body: string): SubtitleData {
  const doc = parseDoc(body);

  const header: Header = mapHeader(doc);

  const blocks: Array<Block> = mapBlocks(doc);

  const styles: Array<Style> = mapStyles(doc);

  return { header, blocks, styles };
}
