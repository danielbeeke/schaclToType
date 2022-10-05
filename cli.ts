import { shaclToFrontendFile } from './src/shaclToFrontendFile.ts'
import { prefixes as protoPrefixes } from './src/helpers/prefixes.ts'
import { turtleToStore } from './src/helpers/turtleToStore.ts'
import { ensureDir } from "https://deno.land/std@0.152.0/fs/mod.ts"

const [source, target, vocab] = Deno.args
if (!source || !target) throw new Error(`Usage: shapes src/models vocab`)

const files = Deno.readDir(source)

await ensureDir(target)

for await (const file of files) {
  const fileData = await Deno.readTextFile(`${source}/${file.name}`)
  const { store: shape } = await turtleToStore(fileData)
  const prefixes: { [key: string]: string } = Object.assign({}, protoPrefixes)
  if (vocab && prefixes[vocab]) prefixes['@vocab'] = prefixes[vocab]
  const contents = await shaclToFrontendFile(shape, { prefixes, languages: ['en', 'nl'] })
  await Deno.writeTextFile(`${target}/${file.name.replace('.ttl', '.ts')}`, contents)
}


