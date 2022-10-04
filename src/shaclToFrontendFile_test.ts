import { turtleToStore } from './helpers/turtleToStore.ts'
import { shaclToFrontendFile } from './shaclToFrontendFile.ts'
import { it, describe } from './deps.ts'
import { get } from '../test.ts'

describe('shaclToQuery', () => {
  it('converts a SHACL shape to a SPARQL query', async () => {
    const fileData = await Deno.readTextFile(`./shapes/Philosopher.ttl`)
    const { store: shape, prefixes: myPrefixes } = await turtleToStore(fileData)
    const context = Object.assign({ '@vocab': myPrefixes.dbp, 'type': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' }, myPrefixes)
    const file = await shaclToFrontendFile(shape, {
      prefixes: context,
      languages: ['en', 'nl']
    })

    Deno.writeTextFileSync('./test.ts', file)

    const items = await get([
      'http://dbpedia.org/resource/Søren_Kierkegaard', 
      'http://dbpedia.org/resource/Immanuel_Kant'
    ])

    console.log(items[0].name)
    console.log(items[1].name)
  })
})