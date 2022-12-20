import { ToFile } from './src/ToFile/ToFile.ts'
import { prefixes as protoPrefixes } from './src/helpers/prefixes.ts'
import { turtleToStore } from './src/helpers/turtleToStore.ts'
import { ensureDir } from './src/deps.ts'
import { indexation } from './src/Indexation/Indexation.ts'

const [source, target, vocab] = Deno.args
if (!source || !target) throw new Error(`Usage: shapesPath outputPath vocab`)

const files = Deno.readDir(source)

await ensureDir(target)

for await (const file of files) {
  const fileData = await Deno.readTextFile(`${source}/${file.name}`)
  const { store: shaclStore } = await turtleToStore(fileData)
  const prefixes: { [key: string]: string } = Object.assign({ '@vocab': vocab }, protoPrefixes)
  if (vocab && prefixes[vocab]) prefixes['@vocab'] = prefixes[vocab]
  const indexationOptions = { shaclStore, prefixes }
  const meta = await indexation(indexationOptions)
  const fileContents = ToFile(meta, indexationOptions)
  await Deno.writeTextFile(`${target}/${file.name.replace('.ttl', '.ts')}`, fileContents)
}


