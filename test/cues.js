const test = require('tape')
const { parse } = require('../dist/vtt-parser');

test('parses a cue id', t => {
  t.plan(1);
  const result = parse('WEBVTT\n\n12\n- Foo');
  const [cue] = result.cues
  t.equal(cue.id, '12');
});
