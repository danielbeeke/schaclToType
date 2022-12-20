import { turtleToStore } from '../helpers/turtleToStore.ts'
import { it, describe, assertEquals } from '../deps.ts'
import { indexation } from './Indexation.ts'

describe('Indexation of a SHACL shape', () => {
  it('converts a SHACL shape to a metadata', async () => {
    const testShapeFiles = await Deno.readDir('./shapes')

    for await (const testShapeFile of testShapeFiles) {
      const fileData = await Deno.readTextFile(`./shapes/${testShapeFile.name}`)
      const expectation = await Deno.readTextFile(`./src/Indexation/expected-json/${testShapeFile.name.replace('.ttl', '.json')}`)

      const { store: shaclStore } = await turtleToStore(fileData)
      const meta = await indexation({ shaclStore })
      assertEquals(meta, JSON.parse(expectation))
    }
  })
})