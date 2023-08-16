import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import fs from 'node:fs';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import ArLocal from 'arlocal';
import { Contract, JWKInterface, LoggerFactory, WarpFactory } from 'warp-contracts';
import { State } from '../interfaces/common';
import { beforeEach } from 'node:test';

describe('Fair Atomic Asset Contract test', () => {
  const arlocal = new ArLocal(1984, false);
  const warp = WarpFactory.forLocal(1984).use(new DeployPlugin());
  LoggerFactory.INST.logLevel('error');

  let contract: Contract<State>;
  let initialState: State;
  let walletAddress: string;
  let wallet: JWKInterface;

  beforeAll(async () => {
    // ~~ Declare all variables ~~

    // ~~ Set up ArLocal ~~
    await arlocal.start();
    // ~~ Initialize 'LoggerFactory' ~~

    // ~~ Set up Warp ~~

    // ~~ Generate wallet and add funds ~~
    ({ jwk: wallet, address: walletAddress } = await warp.generateWallet());

    await warp.testing.addFunds(wallet);

    // ~~ Read contract source and initial state files ~~
    const contractSrc = fs.readFileSync(
      './dist/contract.js',
      'utf8'
    );
  
    // ~~ Update initial state ~~
    initialState = {
      firstOwner: walletAddress,
      balances: {
        [walletAddress]: 1,
      },
      name: 'Fair Protocol NFT Test',
      ticker: 'FNFT',
      claimable: [],
      claims: [],
    };
    // ~~ Deploy contract ~~
    const { contractTxId } = await warp.deploy({
      wallet,
      initState: JSON.stringify(initialState),
      src: contractSrc,
    });
    // ~~ Connect to the pst contract ~~
    contract = warp.contract(contractTxId).connect(wallet) as Contract<State>;
    // ~~ Mine block ~~
   
    await warp.testing.mineBlock();
  });

  afterAll(async () => {
    // ~~ Stop ArLocal ~~
    await arlocal.stop();
  });

  beforeEach(() => {
    contract.connect(wallet);
  });

  it('should read state and balance data', async () => {
    const state = (await contract.readState()).cachedValue.state;
    expect(state).toEqual(initialState);
    expect(state.balances[walletAddress]).toEqual(1);
  });

  it('should transfer tokens', async () => {
    const { address: newAddress } = await warp.generateWallet();
    await contract.writeInteraction({
      function: 'transfer',
      target: newAddress,
      qty: 0.5,
    });
    const state = (await contract.readState()).cachedValue.state;
    expect(state.balances[walletAddress]).toEqual(0.5);
    expect(state.balances[newAddress]).toEqual(0.5);
  });

  it('should allow tokens to be claimed', async () => {
    const { address: newAddress } = await warp.generateWallet();
    const result = await contract.writeInteraction({
      function: 'allow',
      target: newAddress,
      qty: 0.1,
    });
  
    const state = (await contract.readState()).cachedValue.state;
    const claim = state.claimable.find((c) => c.to === newAddress && c.from === walletAddress && c.qty === 0.1 && c.txID === result?.originalTxId);
    expect(claim).toBeDefined();
  });

  it('should be able to claim', async () => {
    const { jwk, address: newAddress } = await warp.generateWallet();
    
    const result = await contract.writeInteraction({
      function: 'allow',
      target: newAddress,
      qty: 0.1,
    });
  
    const state = (await contract.readState()).cachedValue.state;
    const claim = state.claimable.find((c) => c.to === newAddress && c.from === walletAddress && c.qty === 0.1 && c.txID === result?.originalTxId);
    
    contract.connect(jwk);
    await contract.writeInteraction({
      function: 'claim',
      txID: claim?.txID,
      qty: claim?.qty,
    });

    const newState = (await contract.readState()).cachedValue.state;
    const claims = newState.claims;
    const claimables = newState.claimable;
    expect(claimables).not.toContainEqual(claim);
    expect(claims).toContainEqual(claim?.txID);
  });

  it('should be able to reject claims', async () => {
    const { address: newAddress } = await warp.generateWallet();
    
    const result = await contract.writeInteraction({
      function: 'allow',
      target: newAddress,
      qty: 0.1,
    });
  
    const state = (await contract.readState()).cachedValue.state;
    const claim = state.claimable.find((c) => c.to === newAddress && c.from === walletAddress && c.qty === 0.1 && c.txID === result?.originalTxId);
    
    await contract.writeInteraction({
      function: 'reject',
      target: newAddress,
      tx: claim?.txID,
      qty: claim?.qty,
    });

    const newState = (await contract.readState()).cachedValue.state;
    const claims = newState.claims;
    const claimables = newState.claimable;
    expect(claimables).not.toContainEqual(claim);
    expect(claims).not.toContainEqual(claim?.txID);
  });
});