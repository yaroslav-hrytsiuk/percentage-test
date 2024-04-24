import { roundToGreater, getWeek } from './utils';
import { NegativeNumber, UnknownUser } from '../exceptions';
import { CashInConfig, CashOutConfig, UserOperation, UserSumPerWeek, UserType } from '../types';

/**
 * Calculate and setting up week sum of cash-out operations for specific Natural Person user
 */
export const handleNaturalCashOutCache = (item: UserOperation, userSum: UserSumPerWeek): number => {
  const date = new Date(item.date);
  const week = getWeek(date);
  const getYear = date.getFullYear();
  // Set key as year-week to store weekly sum to avoid different years with the same week collision
  const key = `${getYear}-${week}`;

  // Setting weekly sum of cash-out operations for specific Natural Person user
  if (item.user_type === 'natural') {
    userSum[item.user_id] = {
      ...userSum[item.user_id],
      [key]: userSum[item.user_id] && userSum[item.user_id][key] ? (userSum[item.user_id][key] || 0) + item.operation.amount : item.operation.amount,
    }
  }

  // Return weekly sum of cash-out operations for specific Natural Person user if exists
  return userSum[item.user_id] ? userSum[item.user_id][key] : 0;
};

/**
 * Calculate cash-out commission
 */
export const handleCashOut = (item: UserOperation, userSum: UserSumPerWeek, config: CashOutConfig): string => {
  const { user_type: userType, operation: { amount } } = item;

  // Taking weekly sum of cash-out operations for specific Natural Person user
  const naturalSum = handleNaturalCashOutCache(item, userSum);

  if (amount < 0 || naturalSum < 0) {
    throw new NegativeNumber();
  }

  const { natural, juridical } = config;

  switch (userType) {
    case UserType.natural:
      // If amount is greater than weekly limit, return difference between amount and weekly limit
      const isAmountNaturalSum = amount === naturalSum ? amount - natural.weekLimit : amount
      // If weekly sum of cash-out operations for specific Natural Person user is less than weekly limit, return 0
      const amountToPercentage = (naturalSum || 0) > natural.weekLimit ? isAmountNaturalSum : 0;
      const finalNaturalCommission = amountToPercentage * natural.percentage / 100;

      return roundToGreater(finalNaturalCommission);
    case UserType.juridical:
      const commissionCalc = amount * juridical.percentage / 100;
      // If commission is less than min amount, return min amount
      const finalJuridicalCommission = commissionCalc > juridical.minAmount ? commissionCalc : juridical.minAmount;
      
      return roundToGreater(finalJuridicalCommission);
    default:
      throw new UnknownUser();
  }
}

/**
 * Calculate cash-in commission
 */
export const handleCashIn = (amount: number, config: CashInConfig): string => {
  if (amount < 0) {
    throw new NegativeNumber();
  }

  const commissionCalc = amount * config.percentage / 100;
  // If commission is greater than max limit, return max limit
  const finalCommission = commissionCalc > config.maxLimit ? config.maxLimit : commissionCalc;

  return roundToGreater(finalCommission);
}