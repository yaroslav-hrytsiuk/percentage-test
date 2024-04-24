import { describe, expect, test } from '@jest/globals';

import { NegativeNumber, UnknownUser } from '../../src/exceptions';
import { handleCashIn, handleCashOut } from '../../src/lib';
import { CashOperationsConfig, Currency, OperationType, UserType } from '../../src/types';

const operationTemplate = {
  user_id: 1,
  type: OperationType.cash_out,
  date: '2016-01-05',
  operation: {
    amount: 1000,
    currency: Currency.EUR,
  }
}

const config: CashOperationsConfig = {
  cashIn: {
    percentage: 0.03,
    maxLimit: 5,
  },
  cashOut: {
    natural: {
      percentage: 0.3,
      weekLimit: 1000,
    },
    juridical: {
      percentage: 0.3,
      minAmount: 0.5,
    }
  }
}

describe('Test cash-in method', () => {
  test('Cash-in with correct values', () => {
    const result = handleCashIn(1000, config.cashIn)
    expect(result).toBe('0.30');
  });

  test('Cash-in max commission with correct values', () => {
    const result = handleCashIn(1000000, config.cashIn)
    expect(result).toBe('5.00');
  });

  test('Cash-in with negative amount (throw Negative Number Error)', () => {
    try {
      handleCashIn(-1000, config.cashIn)
    } catch (error) {
      expect(error).toBeInstanceOf(NegativeNumber)
    }
  });
});

describe('Test cash-out method', () => {
  const defaultJuridicalUser = {
    ...operationTemplate,
    user_type: UserType.juridical,
  }

  const defaultNaturalUser = {
    ...operationTemplate,
    user_type: UserType.natural,
  }

  describe('Natural user', () => {
    const userSum = {}
    test('Cash-out for natural user with correct values ', () => {
      const result = handleCashOut(defaultNaturalUser, {}, config.cashOut)
      expect(result).toBe('0.00');
    });
  
    test('Cash-out with bigger  for natural user with correct values', () => {
      const caseMockedUser = {
        ...defaultNaturalUser,
        operation: {
          amount: 5000,
          currency: Currency.EUR,
        }
      }
      const result = handleCashOut(caseMockedUser, {}, config.cashOut)
      expect(result).toBe('12.00');
    });
  });

  describe('Juridical user', () => {
    test('Cash-out for juridical user with correct values ', () => {
      const result = handleCashOut(defaultJuridicalUser, {}, config.cashOut)
      expect(result).toBe('3.00');
    });
  
    test('Cash-out min commission for juridical user with correct values', () => {
      const caseMockedUser = {
        ...defaultJuridicalUser,
        operation: {
          amount: 10,
          currency: Currency.EUR,
        }
      }
      const result = handleCashOut(caseMockedUser, {}, config.cashOut)
      expect(result).toBe('0.50');
    });
  })

  test('Cash-out with wrong user type throw Unknown User error', () => {
    try {
      const caseMockedUser = {
        ...defaultJuridicalUser,
        user_type: 'regular' as unknown as UserType
      }
      handleCashOut(caseMockedUser, {}, config.cashOut)
    } catch (error) {
      expect(error).toBeInstanceOf(UnknownUser)
    }
  });

  test('Cash-out with negative amount throw Negative User error', () => {
    try {
      const caseMockedUser = {
        ...defaultJuridicalUser,
        operation: {
          amount: -100,
          currency: Currency.EUR,
        }
      }
      handleCashOut(caseMockedUser, {}, config.cashOut)
    } catch (error) {
      expect(error).toBeInstanceOf(NegativeNumber)
    }
  });
});