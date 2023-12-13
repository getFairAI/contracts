import { JWKInterface, WarpFactory } from 'warp-contracts';
import fs from 'node:fs';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import Bundlr from '@bundlr-network/client/build/cjs/cjsIndex';

const warp = WarpFactory.forMainnet().use(new DeployPlugin());
const srcTxId = process.argv[2];

if (!srcTxId) {
  console.error('Please provide source id: i.e:\n `npm run deploy:instance -- h9v17KHV4SXwdW2-JHU6a23f6R0YtbXZJJht8LfP8QM`');
  process.exit(1);
}

const deploy = async () => {
  const JWK: JWKInterface = JSON.parse(fs.readFileSync('wallet-marketplace.json').toString());

  const address = await warp.arweave.wallets.jwkToAddress(JWK);

  const newTxTags = [
    { name: 'Content-Type', value: 'text/plain' },
    { name: 'App-Name', value: 'SmartWeaveContract' },
    { name: 'App-Version', value: '0.3.0' },
    { name: 'Contract-Src', value: srcTxId }, // use contract source here
    {
      name: 'Init-State',
      value: JSON.stringify({
        owner: address,
        canEvolve: false,
        balances: {
          [address]: 1,
        },
        name: 'Fair Protocol NFT Test',
        ticker: 'FNFT',
      }),
    },
    { name: 'Title', value: 'Fair Protocol NFT test' },
    { name: 'Description', value: 'Description' },
    { name: 'Type', value: 'Text' },
  ];
  const bundlr = new Bundlr('https://node2.bundlr.network', 'arweave', JWK);

  const tx = await bundlr.upload('Fair Protocol NFT test', { tags: newTxTags });
  const { contractTxId, srcTxId: sourceId } = await warp.register(tx.id, 'node2'); // use node2 for dispatch

  console.log(contractTxId);
  console.log(srcTxId);
  console.log(sourceId);
};

(async () => deploy())();