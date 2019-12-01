import { TransformerFn, Timestamp, Block, Option } from '../types';
import { isCue, isNotNull } from '../utils';

const isNegative = (ts: Timestamp) => {
  return ts.hours < 0
    || ts.minutes < 0
    || ts.seconds < 0
    || ts.milliseconds < 0;
}

const skew = (ts: Timestamp, amount: number): Option<Timestamp> => {
  const skewedSeconds = ts.seconds + amount;
  const additionalMinutes = Math.floor(skewedSeconds / 60)

  ts.seconds = skewedSeconds - (additionalMinutes * 60)

  const skewedMinutes = ts.minutes + additionalMinutes;
  const additionalHours = Math.floor(skewedMinutes / 60);

  ts.minutes = skewedMinutes - (additionalHours * 60)
  ts.hours += additionalHours;

  if (isNegative(ts)) {
    return null;
  }

  return ts;
}

const skewRange = (amount: number) =>
  (block: Block): Block | null => {
    if (!isCue(block)) {
      return block;
    }

    const { start, end } = block.range;

    let skewedStart = skew(start, amount);

    if (skewedStart === null) {
      // This is of a little help but still, some subs may live.
      skewedStart = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    }

    const skewedEnd = skew(end, amount);

    if (skewedEnd === null) {
      return null;
    }

    block.range = { start: skewedStart, end: skewedEnd };

    return block;
  }

export const transform: TransformerFn = (data, opts) => {
  data.blocks = data.blocks
    .map(skewRange(opts.timestampSkew))
    .filter(isNotNull);
  return data;
}
