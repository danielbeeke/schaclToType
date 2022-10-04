import { shaclToType } from './shaclToType.ts'
import { turtleToStore } from './helpers/turtleToStore.ts'
import { assertEquals, it, describe } from './deps.ts'
import { prefixes } from './helpers/prefixes.ts'

describe('shaclToType', () => {
  it('converts a SHACL shape to a TypeScript type', async () => {
    const testShapeFiles = await Deno.readDir('./shapes')

    for await (const testShapeFile of testShapeFiles) {
      const fileData = await Deno.readTextFile(`./shapes/${testShapeFile.name}`)
      const expectedType = await Deno.readTextFile(`./types/${testShapeFile.name.replace('.ttl', '.ts')}`)

      const { store: shape } = await turtleToStore(fileData)
      const type = await shaclToType(shape, {
        prefixes: Object.assign({ '@vocab': testShapeFile.name === 'Philosopher.ttl' ? prefixes.dbp : prefixes.schema }, prefixes),
        nameCallback: (name: string) => name.replace('Shape', '') 
      })

      assertEquals(type, expectedType)
    }
  })
})