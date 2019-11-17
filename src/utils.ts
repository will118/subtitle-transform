import { Cue, Block } from './types';

export function isDefined<T>(value: T | undefined): value is T {
  return <T>value !== undefined;
}

export const isCue = (block: Block): block is Cue => 'range' in block;
