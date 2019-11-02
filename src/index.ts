import minimist from 'minimist';
import { readFileSync } from 'fs';
import { parse } from './vtt-parser';
import { generate as generateSRT } from './srt-generator';
import { generate as generateASS } from './ass-generator';

const argv = minimist(process.argv.slice(2));

function run() {
  if (!argv.input) {
    throw new Error('No input file');
  }

  if (typeof argv.input !== 'string') {
    throw new Error('Invalid input file');
  }

  const vttF = readFileSync(argv.input, 'utf8');
  const cssContents = '';
  const subtitleData = parse(vttF, cssContents);

  let generate = generateSRT;

  switch (argv.outputFormat) {
    case 'srt':
      generate = generateSRT;
      break;
    case 'ass':
      generate = generateASS;
      break;
    default:
      throw new Error('Output format not supported');
  }

  const srtOutput = generate(subtitleData);
  console.log(srtOutput);
}

run();
