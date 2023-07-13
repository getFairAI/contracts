import * as esbuild from 'esbuild'

const contracts = ['/contract.ts'];

try {
  await esbuild.build({
    entryPoints: contracts.map((source) => {
      return `./src${source}`;
    }),
    bundle: true,
    minify: false,
    outdir: './dist',
  })
} catch (e) {
  console.error(e)
}