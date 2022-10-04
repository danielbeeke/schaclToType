import { JsonLdContextNormalized } from 'https://esm.sh/jsonld-context-parser@2.2.1'

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

const castValue = (value: RdfJsonTerm, propertyConfig: { singular: boolean, type: string }) => {
  if (propertyConfig.type === 'Date') return new Date(value.value)
  return value.value
}

export const responseToObjects = <Type>(results: RdfJsonRoot, prefixes: { [key: string]: string }, meta: { [key: string]: { [key: string]: { singular: boolean, type: string } } }) => {
  const context = new JsonLdContextNormalized(prefixes)
  const objects: Array<{ [key: string]: any }> = []

  for (const uri of Object.keys(results)) {
    const object: { [key: string]: any } = { id: uri }
    objects.push(object)
  }

  for (const [uri, predicates] of Object.entries(results)) {
    const object = objects.find(object => object.id === uri)!

    const type = predicates["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"].find(item => item.value !== 'http://subject.com/subject')!.value
    const compactedType = context.compactIri(type, true)

    for (const [predicate, values] of Object.entries(predicates)) {
      const compactedPredicate = context.compactIri(predicate, true)
      const propertyConfig = meta[compactedType][compactedPredicate]
 
      object[compactedPredicate] = propertyConfig.singular ? castValue(values[0], propertyConfig) : values.map(term => {
        if (term.type === 'uri' && compactedPredicate !== 'type') {
          const match = objects.find(object => object.id === term.value)
          if (match) return match
        }
        return castValue(term, propertyConfig)
      }).filter(Boolean)
    }  
  }

  const output = objects.filter(object => object['type']?.includes('http://subject.com/subject')) as unknown as Array<Type>

  for (const item of output) {
    const typePredicate = context.compactIri('http://www.w3.org/1999/02/22-rdf-syntax-ns#type', true)
    /** @ts-ignore */
    item[typePredicate] = item[typePredicate].filter(item => item !== 'http://subject.com/subject')
  }

  return output
}