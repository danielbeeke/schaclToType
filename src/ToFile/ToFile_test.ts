import { turtleToStore } from '../helpers/turtleToStore.ts'
import { indexation } from '../Indexation/Indexation.ts'
import { it, describe, assertEquals } from '../deps.ts'
import { ToFile } from './ToFile.ts'

const vocabMapping = {
  'ViewMode.ttl': 'vm',
  'Person.ttl': 'schema',
  'Philosopher.ttl': 'dbp'
} as const

describe('ToFile', () => {
  it('converts a SHACL shape to consumable meta', async () => {
    const testShapeFiles = await Deno.readDir('./shapes')

    for await (const testShapeFile of testShapeFiles) {
			const fileData = await Deno.readTextFile(`./shapes/${testShapeFile.name}`)

			const { store: shaclStore, prefixes } = await turtleToStore(fileData)
			const vocab = prefixes[vocabMapping[testShapeFile.name as keyof typeof vocabMapping]]
      const indexationOptions = { shaclStore, prefixes: Object.assign({ '@vocab': vocab }, prefixes) }
      const meta = await indexation(indexationOptions)
      const fileContents = ToFile(meta, indexationOptions)
			const expectedFile = await Deno.readTextFile(`./src/ToFile/expected-files/${testShapeFile.name.replace('.ttl', '.ts')}`)

			assertEquals(fileContents.trim(), expectedFile.trim())
		}
  })
})