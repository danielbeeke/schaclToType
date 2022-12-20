import { turtleToStore } from '../helpers/turtleToStore.ts'
import { createConstructQuery } from '../ToQuery/ToQuery.ts'
import { indexation } from '../Indexation/Indexation.ts'
import { it, describe, assertEquals } from '../deps.ts'
import { IndexationOptions } from '../types.ts'
import { prefixes as protoPrefixes } from '../helpers/prefixes.ts'
import { fetchQuery } from './Frontend.ts'

const vocabMapping = {
  'ViewMode.ttl': 'vm',
  'Person.ttl': 'schema',
  'Philosopher.ttl': 'dbp'
} as const

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

      const queryOptions = { 
        iris: ['[IRIS]'], 
        languages: ['en'] // TODO language replacements. :(
      }
			const query = createConstructQuery(meta, queryOptions, indexationOptions.context!.getContextRaw())

      const results = await fetchQuery('https://dbpedia.org/sparql', query, ['http://dbpedia.org/resource/Søren_Kierkegaard'])
      console.log(JSON.stringify(results, null, 2))
    }
  })
})