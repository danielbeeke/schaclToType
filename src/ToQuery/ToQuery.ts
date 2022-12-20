import { ObjectMeta, QueryOptions } from '../types.ts'
import { LanguageAware } from './query-parts/LanguageAware.ts'
import { QueryPartBase } from './query-parts/QueryPartBase.ts'
import { Nested } from './query-parts/Nested.ts'
import { Type } from './query-parts/Type.ts'
/** @ts-ignore */
import { Parser, Generator } from 'npm:sparqljs'

export const subjectRecognitionURN = 'urn:shaclToQuery'

export const createQueryParts = (meta: ObjectMeta, queryOptions: QueryOptions, prefixes: { [key: string]: string }, indention = '  ') => {
  return meta.properties!.map(property => {
    const nestedMeta = meta.nestedMetas?.find(nestedMeta => nestedMeta.shapeIri === property.rdfType)
    if (property.predicate === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') return new Type(property, queryOptions, meta, prefixes, indention)
    if (nestedMeta || property.children) return new Nested(property, queryOptions, meta, prefixes, indention, nestedMeta ?? property.children)
    if (property.rdfType === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString') return new LanguageAware(property, queryOptions, meta, prefixes, indention)
    return new QueryPartBase(property, queryOptions, meta, prefixes, indention)
  })
}

export const insertUnions = (queryParts: Array<QueryPartBase>, values: string) => {
  const before = () => ({ construct() { return '' }, where() { return `\n{\n${values}\n` } })
  const after = () => ({ construct() { return '' }, where() { return '\n}\n' } })
  const middle = () => ({ construct() { return '' }, where() { return '\n} UNION' } })

  const queryPartsList = []

  for (const [index, queryPart] of queryParts.entries()) {
    queryPartsList.push(before())
    queryPartsList.push(queryPart)
    queryPartsList.push(index === queryParts.length - 1 ? after() : middle())
  }

  return queryPartsList
}

const createQueryPrefixes = (prefixes: { [key: string]: string }) => {
  const standard = Object.entries(prefixes).map(([alias, iri]) => alias === '@vocab' ? `BASE <${iri}>` : `PREFIX ${alias}: <${iri}>`).join('\n')
  return `
  
  ${standard}
  PREFIX empty: <urn:empty/>
  
  `
}

/**
 * These functions should be detached from the other functions so that it can run standalone in a frontend where the modules would be treeshaked.
 */
export const createConstructQuery = (meta: ObjectMeta, queryOptions: QueryOptions, prefixes: { [key: string]: string }, values: string) => {
  const queryParts = createQueryParts(meta, queryOptions, prefixes)
  // const values = iris?.length ? `VALUES ?s { ${iris.map(iri => iri.includes('://') ? `<${iri}>` : iri).join(' ')} }` : ''
  const realValues = `VALUES ?s { <urn:replace> }`

  const query = `${createQueryPrefixes(prefixes)}

  CONSTRUCT {
    ${queryParts.map(queryPart => queryPart.construct()).join('\n')}
  }
  WHERE {
    ${insertUnions(queryParts, realValues).map(queryPart => queryPart.where()).join('\n')}
  }
  `
  const parser = new Parser()
  const parsedQuery = parser.parse(query)
  const generator = new Generator()
  const newQuery = generator.stringify(parsedQuery)
  return newQuery.replaceAll(/VALUES \?s \{\n( *)<urn:replace>\n( *)}/g, values)
}