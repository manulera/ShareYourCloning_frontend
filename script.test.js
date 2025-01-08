import { ab1ToJson } from '@teselagen/bio-parsers';
import fs from 'fs';
import { getJsonFromAb1Base64 } from './src/utils/sequenceParsers';

describe('ab1ToJson', () => {
  it('should convert an AB1 file to JSON', async () => {
    const binContent = fs.readFileSync('example1.ab1');
    const base64Content = binContent.toString('base64');
    fs.writeFileSync('dummy.txt', base64Content);

    const base64Content2 = fs.readFileSync('dummy.txt', 'utf-8');
    const fileBlob = new Blob([Buffer.from(base64Content2, 'base64')]);
    const json = (await ab1ToJson(fileBlob))[0].parsedSequence;
    console.log(json.sequence);

    const json2 = await getJsonFromAb1Base64(base64Content2);
    console.log('===');
    console.log(json2.sequence);
  });
});
