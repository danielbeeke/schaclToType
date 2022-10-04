
import { JsonLdContextNormalized } from 'https://esm.sh/v95/jsonld-context-parser@2.2.1/es2022/jsonld-context-parser.js'

export type RdfJsonTerm = {
  type: 'bnode' | 'uri' | 'literal' | 'defaultgraph',
  value: string,
  lang?: string,
  datatype?: string
}

export type RdfJsonRoot = {
  [key: string]: {
    [key: string]: Array<RdfJsonTerm>
  }
}

export type Meta =  { [key: string]: { [key: string]: { singular: boolean, type: string } } }

export const castValue = (value: RdfJsonTerm, propertyConfig: { singular: boolean, type: string }) => {
  if (propertyConfig.type === 'Date') return new Date(value.value)
  return value.value
}

export type Prefixes = { [key: string]: string }

const subjectIRI = 'http://subject.com/subject'

export const responseToObjects = <Type>(results: RdfJsonRoot, prefixes: Prefixes, meta: Meta) => {
  const context = new JsonLdContextNormalized(prefixes)
  const objects: Array<{ [key: string]: any }> = []
  const typePredicate = context.compactIri('http://www.w3.org/1999/02/22-rdf-syntax-ns#type', true)

  for (const uri of Object.keys(results)) {
    const object: { [key: string]: any } = { id: uri }
    objects.push(object)
  }

  for (const [uri, predicates] of Object.entries(results)) {
    const object = objects.find(object => object.id === uri)!

    const type = predicates["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"].find(item => item.value !== subjectIRI)!.value
    const compactedType = context.compactIri(type, true)

    for (const [predicate, values] of Object.entries(predicates)) {
      const compactedPredicate = context.compactIri(predicate, true)
      const propertyConfig = meta[compactedType][compactedPredicate]
 
      object[compactedPredicate] = propertyConfig.singular ? castValue(values[0], propertyConfig) : values.map(term => {
        if (term.type === 'uri' && compactedPredicate !== typePredicate) {
          const match = objects.find(object => object.id === term.value)
          if (match) return match
        }
        return castValue(term, propertyConfig)
      }).filter(Boolean)
    }  
  }

  const output = objects.filter(object => object[typePredicate]?.includes(subjectIRI)) as unknown as Array<Type>

  for (const item of output) {
    /** @ts-ignore */
    item[typePredicate] = item[typePredicate].filter(item => item !== subjectIRI)
  }

  return output
}

export const getter = async <Type>(query: string, endpoint: string, iris: Array<string>, prefixes: Prefixes, meta: Meta): Promise<Array<Type>> => {
  const values = iris.map(iri => `<${iri}>`)
  const preparedQuery = query.replace('VALUES ?s { }', `VALUES ?s { ${values.join(' ')} }`)

  const body = new FormData()
  body.set('query', preparedQuery)
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { accept: 'application/rdf+json' },
    body
  })

  const results = await response.json()
  return responseToObjects(results, prefixes, meta)
}

