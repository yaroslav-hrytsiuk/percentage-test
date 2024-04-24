import { describe, expect, test } from '@jest/globals';

import { getWeek, roundToGreater, stdOut } from '../../src/lib';
import { InvalidDate, NegativeNumber } from '../../src/exceptions';

describe('Test utils functions', () => {
  test('Get Week function with correct values', () => {
    const result = getWeek(new Date('2016-01-10'))
    expect(result).toBe(1);
  });

  test('Get Week function with bad values', () => {
    try {
      getWeek(new Date('123123123123'))
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidDate)
    }
  });

  test('Round to greater with correct values', () => {
    const result = roundToGreater(0.001)
    expect(result).toBe('0.01');
  });
  
  test('Round to greater with bad values', () => {
    try {
      roundToGreater(-0.1)
    } catch (error) {
      expect(error).toBeInstanceOf(NegativeNumber)
    }
  });

  test('Output to console', () => {
    const mockOutput = jest.spyOn(process.stdout, 'write').mockImplementation()
    const values = ['0.01', '0.02', '0.03']
    stdOut(values)
    expect(mockOutput).toHaveBeenCalledTimes(3)
  })
})
