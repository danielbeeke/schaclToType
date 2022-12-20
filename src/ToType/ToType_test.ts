import { ToType } from './ToType.ts'
import { turtleToStore } from '../helpers/turtleToStore.ts'
import { assertEquals, it, describe } from '../deps.ts'
import { indexation } from '../Indexation/Indexation.ts'
import { prefixes } from '../helpers/prefixes.ts'

const vocabMapping = {
  'ViewMode.ttl': 'vm',
  'Person.ttl': 'schema',
  'Philosopher.ttl': 'dbp'
} as const

describe('shaclToType', () => {
  it('converts a SHACL shape to a TypeScript type', async () => {
    const testShapeFiles = await Deno.readDir('./shapes')

    for await (const testShapeFile of testShapeFiles) {
      const fileData = await Deno.readTextFile(`./shapes/${testShapeFile.name}`)
      const { store: shaclStore } = await turtleToStore(fileData)
      const vocab = prefixes[vocabMapping[testShapeFile.name as keyof typeof vocabMapping]]
      const indexationOptions = { shaclStore, prefixes: Object.assign({ '@vocab': vocab }, prefixes) }
      const meta = await indexation(indexationOptions)
      const type = await ToType(meta, indexationOptions)
      const expectedType = await Deno.readTextFile(`./src/ToType/expected-types/${testShapeFile.name.replace('.ttl', '.ts')}`)

      assertEquals(type, expectedType)
    }
  })
})