import minimist from 'minimist';
import { readFileSync } from 'fs';
import { parse as parseVTT } from './vtt-parser';
import { parse as parseTT } from './tt-parser';
import { generate as generateSRT } from './srt-generator';
import { generate as generateASS } from './ass-generator';

const argv = minimist(process.argv.slice(2));

const REQUIRED_ARGS = ['input', 'inputFormat', 'output', 'outputFormat'];

function run() {
  for (const arg of REQUIRED_ARGS) {
    const value = argv[arg];
    if (!value || typeof argv.input !== 'string') {
      throw new Error(`Invalid ${arg} arg`);
    }
  }

  const inputContents = readFileSync(argv.input, 'utf8');

  let parse = null;

  switch (argv.inputFormat) {
    case 'tt':
      parse = parseTT;
      break;
    case 'vtt':
      parse = parseVTT;
      break;
    default:
      throw new Error('Input format not supported');
  }

  let generate = null

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

  const srtOutput = generate(parse(inputContents));
  console.log(srtOutput);
}

run();
