import * as esbuild from 'esbuild';

const contracts = ['/atomic-assets/contract.ts'];

try {
  await esbuild.build({
    entryPoints: contracts.map((source) => {
      return `./src${source}`;
    }),
    bundle: true,
    minify: false,
    outfile: './dist/atomic-asset-contract.js',
  });
} catch (e) {
  console.error(e);
}