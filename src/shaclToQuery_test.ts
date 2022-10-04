import { turtleToStore } from './helpers/turtleToStore.ts'
import { shaclToQuery } from './shaclToQuery.ts'
import { it, describe } from './deps.ts'

describe('shaclToQuery', () => {
  it('converts a SHACL shape to a SPARQL query', async () => {
    const fileData = await Deno.readTextFile(`./shapes/Philosopher.ttl`)
    const { store: shape, prefixes } = await turtleToStore(fileData)
    const context = Object.assign({ '@vocab': prefixes.dbp }, prefixes)
    const query = await shaclToQuery(shape, {
      prefixes: context,
      languages: ['en', 'nl']
    })

    // console.log(query)
  })
})