import { ClaimAction, State } from '../interfaces/common';
import { checkNumber } from '../utils/validate';

export const claim = (state: State, action: ClaimAction) => {
  ContractAssert(!!action.input.txID, 'txID is required');

  if (!state.claimable) {
    state.claimable = [];
  }

  const qty = checkNumber(action.input.qty);
  const idx = state.claimable.findIndex((c) => c.txID === action.input.txID);

  ContractAssert(idx >= 0, 'claimable not found');
  ContractAssert(state.claimable[idx].qty === qty, 'claimable qty is not equal to claim qty');
  ContractAssert(state.claimable[idx].to === action.caller, 'claimable is not addressed to caller');

  if (!state.balances[action.caller]) {
    state.balances[action.caller] = 0;
  }

  state.balances[action.caller] += qty;
  state.claimable.splice(idx, 1);

  return { state };
};
