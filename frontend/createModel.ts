import { responseToObjects } from './responseToObjects.ts'
import { Prefixes, Meta } from './types.ts'

export const createModel = <Type>(endpoint: string, { prefixes, meta, query }: { prefixes: Prefixes, meta: Meta, query: string }) => {

  function get (iris: Array<string>): Promise<Array<Type>>
  function get (iri: string): Promise<Type>
  async function get (input: Array<string> | string) {
    const iris = typeof input === 'string' ? [input] : input
    const values = iris.map(iri => iri.includes('://') ? `<${iri}>` : iri)
    const preparedQuery = query.replace('VALUES ?s { }', `VALUES ?s { ${values.join(' ')} }`)

    const body = new FormData()
    body.set('query', preparedQuery)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { accept: 'application/rdf+json' },
      body
    })

    try {
      const results = await response.json()
      const output = responseToObjects(results, prefixes, meta)
      return typeof input === 'string' ? output.pop() : output  
    }
    catch (exception) {
      console.error(exception)
    }
  }

  return { get }
}