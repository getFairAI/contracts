import { Claim, RejectAction, State } from '../interfaces/common';

export const reject = (state: State, action: RejectAction) => {
  ContractAssert(!!action.input.tx, 'tx is required');
  ContractAssert(!!action.input.qty, 'qty is required');
  ContractAssert(action.input.tx.length === 43, 'tx is not valid');
  ContractAssert(!Number.isNaN(action.input.qty), 'Qty is not a number');
  
  if (!state.claimable) {
    state.claimable = [];
  }

  const claim = state.claimable.find((c) => c.txID === action.input.tx);
  ContractAssert(!!claim, 'claim not found');

  const existingClaim = claim as Claim;
  ContractAssert(existingClaim.to === action.caller, 'claim in not addressed to caller');

  if (!state.balances[existingClaim.from]) {
    state.balances[existingClaim.from] = 0;
  }

  // add claim amount back to balance
  state.balances[existingClaim.from] += existingClaim.qty;

  // remove claim
  state.claimable = state.claimable.filter((c) => c.txID !== existingClaim.txID);

  return { state };
};
