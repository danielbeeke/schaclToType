import { turtleToStore } from './helpers/turtleToStore.ts'
import { shaclToFrontendFile } from './shaclToFrontendFile.ts'
import { it, describe, assertEquals } from './deps.ts'
import { createModel } from '../frontend/createModel.ts'
import { prefixes } from './helpers/prefixes.ts'

describe('shaclToFrontendFile', () => {
  it('converts a SHACL shape to a file that is consumable by a frontend', async () => {
    const fileData = await Deno.readTextFile(`./shapes/Philosopher.ttl`)
    const { store: shape } = await turtleToStore(fileData)
    const file = await shaclToFrontendFile(shape, {
      prefixes: Object.assign({ '@vocab': prefixes.dbp }, prefixes),
      languages: ['en', 'nl']
    })

    const tempFile = await Deno.makeTempFile({ suffix: '.ts' })
    await Deno.writeTextFile(tempFile, file)
    const PhilosopherMeta = await import(tempFile)

    const Philosopher = createModel('https://dbpedia.org/sparql', PhilosopherMeta)

    const items = await Philosopher.get([
      'http://dbpedia.org/resource/Søren_Kierkegaard', 
      'http://dbpedia.org/resource/Immanuel_Kant'
    ]) as any


    assertEquals(items[0].label, 'Immanuel Kant')
    assertEquals(items[1].label, 'Søren Kierkegaard')
    assertEquals(items[1].birthPlace?.[0].name, 'Copenhagen')
    assertEquals(items[1].birthDate instanceof Date, true)
  })
})