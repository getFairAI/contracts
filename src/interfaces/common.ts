export interface Claim {
  from: string;
  to: string;
  qty: number;
  txID: string;
}

export interface State {
  firstOwner: string;
  balances: { [key: string]: number };
  ticker: string;
  name: string;
  claimable: Claim[];
  claims: string[]; // stores claimed txid
}

export interface Input {
  function: string;
  target?: string;
  qty?: number;
}

export interface ConstructorInput extends Input {
  args: {
    firstOwner: string;
  };
}

export interface RejectInput extends Input {
  tx: string;
}

export interface ClaimInput extends Input {
  txID: string;
}

export interface Action {
  input: Input;
  caller: string;
}

export interface ConstructorAction extends Action {
  input: ConstructorInput;
}

export interface RejectAction extends Action {
  input: RejectInput;
}

export interface ClaimAction extends Action {
  input: ClaimInput;
}

export type readFn = (state: State, action: Action) => { result: unknown };
export type writeFn = (state: State, action: Action) => { state: State };
