import { ParserFn, ParserOpts, Header, Block, Style } from '../../types';
import { mapHeader } from './header';
import { mapStyles } from './styles';
import { mapBlocks } from './blocks';
import { parseDoc } from './doc';

export const parse: ParserFn = (body: string, _opts: ParserOpts) => {
  const doc = parseDoc(body);

  const header: Header = mapHeader(doc);

  const blocks: Array<Block> = mapBlocks(doc);

  const styles: Array<Style> = mapStyles(doc);

  return { header, blocks, styles };
}
