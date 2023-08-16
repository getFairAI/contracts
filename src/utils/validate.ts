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
