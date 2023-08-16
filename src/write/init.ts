import { ConstructorAction, State } from '../interfaces/common';

export const init = (state: State, action: ConstructorAction) => {
  ContractAssert(!!action.input.args, 'Missing "args" paramenter in constructor');
  ContractAssert(
    !!action.input.args.firstOwner,
    'Missing "owner" parameter in constructor "args" parameter',
  );
  const firstOwner = action.input.args.firstOwner;

  if (!state.claimable) {
    state.claimable = [];
  }
  
  if (!state.claims) {
    state.claims = [];
  }

  if (!state.balances) {
    state.balances = {};
  }

  state.balances[firstOwner] = 1;

  state.name = 'Fair Protocol NFT';
  state.ticker = 'FNFT';

  state.firstOwner = firstOwner;

  return { state };
};
