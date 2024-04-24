import { describe, expect, test } from '@jest/globals';

import { WrongPath } from '../../src/exceptions';
import { readInputFile } from '../../src/lib';

describe('Test read file method', () => {
  test('Read file with correct path', async () => {
    const result = await readInputFile('test/testInput.json')
    expect(result).toHaveLength(5);
  })
  
  // test('Cash-in with negative amount (throw Negative Number Error)', () => {
  //   try {
  //     readInputFile('files/unknown.json')
  //   } catch (error) {
  //     expect(error).toBeInstanceOf(WrongPath)
  //   }
  // });
});