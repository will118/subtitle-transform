#!/usr/bin/env node

import minimist from 'minimist';
import { readFileSync } from 'fs';
import { ParserFn, GeneratorFn } from './types';
import { parse as parseVTT } from './parsers/vtt';
import { parse as parseTT } from './parsers/tt';
import { generate as generateSRT } from './generators/srt';
import { generate as generateASS } from './generators/ass';
import { transform as transformSkew } from './transformers/skew';

const argv = minimist(process.argv.slice(2));

const REQUIRED_ARGS = ['inputFormat', 'outputFormat'];

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

  let input = argv.input;

  if (!input) {
    // read from stdin
    input = 0;
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

  const generatorOpts = { enableStyles: false };

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
      generatorOpts.enableStyles = true;
      generate = generateASS;
      break;
  }

  const transformerOpts = { timestampSkew: argv.timestampSkew };

  if (generate === null) {
    console.error('Unsupported output format');
    process.exit(1);
  }

  const output = generate(
    transformSkew(
      parse(inputContents, parseOpts),
      transformerOpts
    ),
    generatorOpts
  );

  console.log(output);
}

run();
