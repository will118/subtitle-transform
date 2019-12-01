const test = require('tape')
const { TagType } = require('../../dist/types');
const { transform } = require('../../dist/transformers/skew');

const createSubtitleData = timestamps => {
  return {
    blocks: timestamps.map(range => {
      return {
        range,
        id: null,
        lines: [
          [
            {
              tag: {
                type: TagType.Class,
                className: 'yellow',
              },
              children: [ 'Yes, hello yes' ]
            }
          ]
        ],
        settings: null,
      }
    })
  }
}

const range = (h, m, s, ms) => ({
  start: {
    hours: h, minutes: m, seconds: s, milliseconds: ms
  },
  end: {
    hours: h, minutes: m, seconds: s, milliseconds: ms
  }
});

test('adds seconds to timestamp with no rollover', t => {
  t.plan(1);
  const data = createSubtitleData([range(0, 0, 4, 0)]);
  const skewed = transform(data, { timestampSkew: 40 });
  const [cue] = data.blocks;
  t.deepEqual(cue.range, range(0, 0, 44, 0));
});

test('removes seconds from timestamp with no rollover', t => {
  t.plan(1);
  const data = createSubtitleData([range(0, 0, 34, 0)]);
  const skewed = transform(data, { timestampSkew: -11 });
  const [cue] = data.blocks;
  t.deepEqual(cue.range, range(0, 0, 23, 0));
});

test('adds seconds to timestamp with rollover', t => {
  t.plan(1);
  const data = createSubtitleData([range(0, 0, 56, 0)]);
  const skewed = transform(data, { timestampSkew: 4 });
  const [cue] = data.blocks;
  t.deepEqual(cue.range, range(0, 1, 0, 0));
});

test('adds minutes of seconds to timestamp with rollover', t => {
  t.plan(1);
  const data = createSubtitleData([range(0, 0, 56, 0)]);
  const skewed = transform(data, { timestampSkew: 400 });
  const [cue] = data.blocks;
  t.deepEqual(cue.range, range(0, 7, 36, 0));
});

test('adds hours of seconds to timestamp with rollover', t => {
  t.plan(1);
  const data = createSubtitleData([range(0, 55, 56, 0)]);
  const skewed = transform(data, { timestampSkew: 400 });
  const [cue] = data.blocks;
  t.deepEqual(cue.range, range(1, 2, 36, 0));
});

test('removes seconds from timestamp with rollover', t => {
  t.plan(1);
  const data = createSubtitleData([range(0, 1, 16, 0)]);
  const skewed = transform(data, { timestampSkew: -40 });
  const [cue] = data.blocks;
  t.deepEqual(cue.range, range(0, 0, 36, 0));
});

test('removes minutes of seconds from timestamp with rollover', t => {
  t.plan(1);
  const data = createSubtitleData([range(0, 7, 36, 0)]);
  const skewed = transform(data, { timestampSkew: -400 });
  const [cue] = data.blocks;
  t.deepEqual(cue.range, range(0, 0, 56, 0));
});

test('removes hours of seconds from timestamp with rollover', t => {
  t.plan(1);
  const data = createSubtitleData([range(1, 7, 36, 0)]);
  const skewed = transform(data, { timestampSkew: -4000 });
  const [cue] = data.blocks;
  t.deepEqual(cue.range, range(0, 0, 56, 0));
});

test('removes cues that end before 0, 0, 0, 0', t => {
  t.plan(1);
  const data = createSubtitleData([
    range(0, 0, 34, 0),
    range(0, 0, 44, 0),
  ]);
  const skewed = transform(data, { timestampSkew: -35 });
  t.equal(data.blocks.length, 1);
});

test('leaves cues that start before 0, 0, 0, 0 but end after', t => {
  t.plan(2);
  const data = createSubtitleData([
    {
      start: {
        hours: 0, minutes: 0, seconds: 30, milliseconds: 0
      },
      end: {
        hours: 0, minutes: 1, seconds: 15, milliseconds: 0
      }
    }
  ]);
  const skewed = transform(data, { timestampSkew: -35 });
  t.equal(data.blocks.length, 1);
  t.deepEqual(data.blocks[0].range, {
    start: {
      hours: 0, minutes: 0, seconds: 0, milliseconds: 0
    },
    end: {
      hours: 0, minutes: 0, seconds: 40, milliseconds: 0
    }
  });
});
