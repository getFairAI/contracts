import { writeFn } from '../interfaces/common.js';

export const allow: writeFn = (state, action) => {
  // qty checks
  ContractAssert(!!action.input.qty, 'Missing "qty" parameter in allow');
  const qty = action.input.qty as number;
  ContractAssert(!Number.isNaN(qty), 'Qty is not a number');

  // caller checks
  ContractAssert(!!action.caller, 'Caller is required');
  ContractAssert(action.caller.length === 43, 'Caller is not valid');
  ContractAssert(action.caller !== action.input.target, 'Caller cannot be target');
  ContractAssert(!!state.balances[action.caller], 'Caller has no Balance');
  ContractAssert(state.balances[action.caller] >= qty, 'Caller has not enough balance');

  // target checks
  ContractAssert(!!action.input.target, 'Missing "target" parameter in allow');
  const target = action.input.target as string;
  ContractAssert(
    target !== SmartWeave.transaction.id,
    'Cant setup claim to transfer a balance to itself',
  );
  ContractAssert(target.length === 43, 'Target is not valid');

  state.balances[action.caller] -= qty;
  if (!state.claimable) {
    state.claimable = [];
  }
  state.claimable.push({
    from: action.caller,
    to: target,
    txID: SmartWeave.transaction.id,
    qty,
  });

  return { state };
};
