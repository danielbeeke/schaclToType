import { turtleToStore } from '../helpers/turtleToStore.ts'
import { createConstructQuery } from './ToQuery.ts'
import { indexation } from '../Indexation/Indexation.ts'
import { it, describe, assertEquals } from '../deps.ts'
import { IndexationOptions } from '../types.ts'
import { prefixes as protoPrefixes } from '../helpers/prefixes.ts'

const vocabMapping = {
  'ViewMode.ttl': 'vm',
  'Person.ttl': 'schema',
  'Philosopher.ttl': 'dbp'
} as const

const iriMapping = {
  'ViewMode.ttl': ['https://rdf.mediaworks.global/viewmodes/video-card'],
  'Person.ttl': ['http://dbpedia.org/resource/Søren_Kierkegaard'],
  'Philosopher.ttl': ['http://dbpedia.org/resource/Søren_Kierkegaard']
}

describe('createConstructQuery', () => {
  it('converts a SHACL shape to a SPARQL query', async () => {
    const testShapeFiles = await Deno.readDir('./shapes')

    for await (const testShapeFile of testShapeFiles) {      

      if (testShapeFile.name !== 'Philosopher.ttl') continue

			const fileData = await Deno.readTextFile(`./shapes/${testShapeFile.name}`)
			const { store: shaclStore, prefixes } = await turtleToStore(fileData)
			const vocab = prefixes[vocabMapping[testShapeFile.name as keyof typeof vocabMapping]]
      const indexationOptions: IndexationOptions = { shaclStore, prefixes: Object.assign({ '@vocab': vocab }, prefixes, protoPrefixes) }
      const meta = await indexation(indexationOptions)
			const expectedQuery = await Deno.readTextFile(`./src/ToQuery/expected-queries/${testShapeFile.name.replace('.ttl', '.sparql')}`)

      const queryOptions = { 
        iris: iriMapping[testShapeFile.name as keyof typeof iriMapping], 
        languages: ['en', 'nl'] 
      }
			const query = createConstructQuery(meta, queryOptions, indexationOptions.context!.getContextRaw())
      console.log(query)
			// assertEquals(query.trim(), expectedQuery.trim())
		}
  })
})