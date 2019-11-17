import { GeneratorFn, GeneratorOpts, SubtitleData } from './types';

export const generate: GeneratorFn = (
  sub: SubtitleData,
  _opts: GeneratorOpts
) => {
  return sub.toString();
}
