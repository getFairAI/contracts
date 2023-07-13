import { readFn } from '../interfaces/common';

export const balance: readFn = (state, action) => {
  // if not target then get balance for caller
  if (!action.input.target) {
    action.input.target = action.caller;
  }
  ContractAssert(action.input.target.length === 43, 'Target is not valid');

  return {
    result: {
      target: action.input.target,
      balance: state.balances[action.input.target] || 0,
    },
  };
};
