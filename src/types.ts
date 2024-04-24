export enum UserType {
  natural = 'natural',
  juridical = 'juridical'
}

export enum OperationType {
  cash_in = 'cash_in',
  cash_out = 'cash_out'
}

export enum Currency {
  EUR = 'EUR'
}

export type Operation = {
  amount: number;
  currency: Currency;
}

export type UserOperation = {
  date: string;
  user_id: number;
  user_type: UserType;
  type: OperationType;
  operation: Operation;
}

export type SumPerWeek = {
  [key: string]: number;
}

export type UserSumPerWeek = {
  [key: string]: SumPerWeek;
}

export type CashInConfig = {
  percentage: number;
  maxLimit: number;
}

export type CashOutConfig = {
  natural: {
    percentage: number;
    weekLimit: number;
  },
  juridical: {
    percentage: number;
    minAmount: number;
  }
}

export type CashOperationsConfig = {
  cashIn: CashInConfig,
  cashOut: CashOutConfig
}