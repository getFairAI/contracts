import { JWKInterface, WarpFactory } from 'warp-contracts';
import fs from 'node:fs';
import { ArweaveSigner, DeployPlugin } from 'warp-contracts-plugin-deploy';

const warp = WarpFactory.forMainnet().use(new DeployPlugin());

const builtFile = process.argv[2];
if (!builtFile) {
  console.error('Please provide the location of the built file. i.e:\n `npm run deploy:src -- dist/atomic-asset-contract.js`');
  process.exit(1);
}

const deploy = async () => {
  try {
    const contractSrc = fs.readFileSync(
      builtFile,
      'utf8'
    ); 
  
    const JWK: JWKInterface = JSON.parse(fs.readFileSync('wallet-marketplace.json').toString());

    const newSource = await warp.createSource({ src: contractSrc }, new ArweaveSigner(JWK));
    const newSrcId = await warp.saveSource(newSource);

    console.log(newSource);
    console.log(newSrcId);
  } catch (err) {
    console.log(err);
  }
};

(async () => deploy())();