import { State } from '../interfaces/common';

export const checkAndConvert = <T>(value: T, condition: boolean, message: string) => {
  if (!condition) {
    throw new ContractError(message);
  }
  return value as Required<T>;
};

export const validate = (state: State) => {
  ContractAssert(!!state.firstOwner, 'First owner is required!');
  ContractAssert(!!state.name, 'Name is required!');
  ContractAssert(!!state.ticker, 'Ticker is required!');
  ContractAssert(!!state.balances, 'Balances is required!');
};

export const checkNumber = (value?: string | number) => {
  ContractAssert(!!value, 'Missing "qty" parameter in transfer');
  if (typeof value === 'string') {
    const parsedQty = parseInt(value, 10);
    ContractAssert(!Number.isNaN(parsedQty), 'Qty is not a number');
    return parsedQty;
  } else if (typeof value === 'number') {
    ContractAssert(!Number.isNaN(value), 'Qty is not a number');
    return value;
  } else {
    throw new ContractError('Qty is not valid');
  }
};