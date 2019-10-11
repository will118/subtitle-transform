import { parse } from './vtt-parser';
import { generate } from './ass-generator';

function run(vttFile: string, assOutputFile: string, cssFiles?: Array<string>) {
  const cssContents = cssFiles && cssFiles.join('\n');
  const subtitleData = parse(vttFile, cssContents);
  const assOutput = generate(subtitleData);
  console.log(assOutputFile, assOutput);
}

export default run;
