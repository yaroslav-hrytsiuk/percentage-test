import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { WrongPath } from '../exceptions';
import { UserOperation } from '../types';

export const readInputFile = async (path: string): Promise<UserOperation[]> => {
  try {
    const file: string = resolve(path);
    const content: string = await readFile(file, { encoding: 'utf8' })
    const data: UserOperation[] = JSON.parse(content);

    return data;
  } catch (e) {
    throw new WrongPath();
  }
}
