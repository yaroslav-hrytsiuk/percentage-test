import { UnknownOperation } from './exceptions';
import { handleCashIn, handleCashOut, readInputFile, stdOut } from './lib';
import { CashOperationsConfig, OperationType, UserOperation, UserSumPerWeek } from './types';

// Set configuration settings
const settings: CashOperationsConfig = require('./settings.json');

async function main() {
  // Get the file name from the command line
  const path: string = `files/${process.argv.at(-1)}`
  const data: UserOperation[] = await readInputFile(path)
  const userSum: UserSumPerWeek = {}
  
  const result: string[] = data.map((item: UserOperation) => {
    switch (item.type) {
      case OperationType.cash_in:
        return handleCashIn(item.operation.amount, settings.cashIn);
      case OperationType.cash_out:
        return handleCashOut(item, userSum, settings.cashOut);
      default:
        throw new UnknownOperation();
    }
  })

  return stdOut(result);
}

main()
