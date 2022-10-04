import { turtleToStore } from './helpers/turtleToStore.ts'
import { shaclToFrontendFile } from './shaclToFrontendFile.ts'
import { it, describe, assertEquals } from './deps.ts'
import { get } from '../test.ts'

describe('shaclToFrontendFile', () => {
  it('converts a SHACL shape to a file that is consumable by a frontend', async () => {
    const fileData = await Deno.readTextFile(`./shapes/Philosopher.ttl`)
    const { store: shape, prefixes: myPrefixes } = await turtleToStore(fileData)
    const context = Object.assign({ '@vocab': myPrefixes.dbp, 'type': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' }, myPrefixes)
    const file = await shaclToFrontendFile(shape, {
      prefixes: context,
      languages: ['en', 'nl']
    }, './frontend-helpers.ts')

    Deno.writeTextFileSync('./test.ts', file)

    const items = await get('https://dbpedia.org/sparql', [
      'http://dbpedia.org/resource/Søren_Kierkegaard', 
      'http://dbpedia.org/resource/Immanuel_Kant'
    ])

    assertEquals(items[0].name, 'Immanuel Kant')
    assertEquals(items[1].name, 'Søren Kierkegaard')
    assertEquals(items[1].birthPlace?.[0].name, 'Copenhagen')
    assertEquals(items[1].birthDate instanceof Date, true)
  })
})