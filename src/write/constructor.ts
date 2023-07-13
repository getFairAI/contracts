import { ConstructorAction, State } from "../interfaces/common"

export const constructor = (state: State, action: ConstructorAction) => {
  ContractAssert(!!action.input.args, 'Missing "args" paramenter in constructor');
  ContractAssert(!!action.input.args.owner, 'Missing "owner" parameter in constructor "args" parameter');
  const owner = action.input.args.owner;

  if (!state.claimable) {
    state.claimable = []
  }

  if (!state.balances) {
    state.balances = {}
  }


  state.balances[owner] = 1;

  state.name = 'Fair Protocol NFT Test'
  state.ticker = 'FNFT'

  return { state }

}