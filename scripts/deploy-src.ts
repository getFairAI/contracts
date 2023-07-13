import { JWKInterface, WarpFactory } from 'warp-contracts';
import fs from 'node:fs';
import { ArweaveSigner, DeployPlugin } from 'warp-contracts-plugin-deploy';

const warp = WarpFactory.forMainnet().use(new DeployPlugin());;
const contractSrc = fs.readFileSync(
  './dist/contract.js',
  'utf8'
);

const deploy = async () => {
  const JWK: JWKInterface = JSON.parse(fs.readFileSync('wallet-marketplace.json').toString());

  const newSource = await warp.createSource({ src: contractSrc }, new ArweaveSigner(JWK));
  const newSrcId = await warp.saveSource(newSource);

  console.log(newSource);
  console.log(newSrcId);
};

(async () => deploy())();