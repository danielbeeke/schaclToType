import * as esbuild from 'https://deno.land/x/esbuild@v0.15.10/mod.js'
await esbuild.build({
  entryPoints: ['./frontend/createModel.ts'],
  bundle: true,
  minify: true,
  format: 'esm',
  target: ['chrome100'],
  outfile: './createModel.mjs'
})

esbuild.stop()