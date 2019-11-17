import minimist from 'minimist';
import { readFileSync } from 'fs';
import { ParserFn, GeneratorFn } from './types';
import { parse as parseVTT } from './vtt-parser';
import { parse as parseTT } from './tt-parser';
import { generate as generateSRT } from './srt-generator';
import { generate as generateASS } from './ass-generator';

const argv = minimist(process.argv.slice(2));

const REQUIRED_ARGS = ['input', 'inputFormat', 'outputFormat'];

function run() {
  for (const arg of REQUIRED_ARGS) {
    const value = argv[arg];
    if (!value) {
      throw new Error(`Missing "${arg}" arg`);
    }
    if (typeof argv.input !== 'string') {
      throw new Error(`Invalid "${arg}" arg`);
    }
  }

  const inputContents = readFileSync(argv.input, 'utf8');

  const parseOpts = {};

  let parse: ParserFn | null = null;

  switch (argv.inputFormat) {
    case 'tt':
      parse = parseTT;
      break;
    case 'vtt':
      parse = parseVTT;
      break;
  }

  if (parse === null) {
    console.error('Unsupported input format');
    process.exit(1);
  }

  const generatorOpts = {
    enableStyles: false,
  };

  let generate: GeneratorFn | null = null

  switch (argv.outputFormat) {
    case 'srt':
      generate = generateSRT;
      break;
    case 'srt-styled':
      generatorOpts.enableStyles = true;
      generate = generateSRT;
      break;
    case 'ass':
      generate = generateASS;
      break;
  }

  if (generate === null) {
    console.error('Unsupported output format');
    process.exit(1);
  }

  const srtOutput = generate(parse(inputContents, parseOpts), generatorOpts);
  console.log(srtOutput);
}

run();
