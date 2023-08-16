import { ClaimAction, State } from '../interfaces/common.js';

export const claim = (state: State, action: ClaimAction) => {
  ContractAssert(!!action.input.txID, 'txID is required');
  ContractAssert(!!action.input.qty, 'qty is required');

  if (!state.claimable) {
    state.claimable = [];
  }

  const qty = action.input.qty as number;
  const idx = state.claimable.findIndex((c) => c.txID === action.input.txID);

  ContractAssert(idx >= 0, 'claimable not found');
  ContractAssert(state.claimable[idx].qty === qty, 'claimable qty is not equal to claim qty');
  ContractAssert(state.claimable[idx].to === action.caller, 'claimable is not addressed to caller');

  if (!state.balances[action.caller]) {
    state.balances[action.caller] = 0;
  }

  state.balances[action.caller] += qty;
  state.claimable.splice(idx, 1);

  if (!state.claims) {
    state.claims = [];
  }

  state.claims.push(action.input.txID);

  return { state };
};
