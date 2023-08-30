import { balance } from './read/balance';
import { allow } from './write/allow';
import { claim } from './write/claim';
import { transfer } from './write/transfer';
import { validate } from './utils/validate';
import { reject } from './write/reject';
import { Action, ClaimAction, RejectAction, State } from './interfaces/common';

export async function handle(state: State, action: Action) {
  validate(state);
  switch (action.input?.function) {
    case 'balance':
      return balance(state, action);
    case 'transfer':
      return transfer(state, action);
    case 'allow':
      return allow(state, action);
    case 'reject':
      return reject(state, action as RejectAction);
    case 'claim':
      return claim(state, action as ClaimAction);
    default:
      throw new ContractError('Function not found');
  }
}
