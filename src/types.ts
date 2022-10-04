import { JsonLdContextNormalized } from './deps.ts'

export type Options = {
  // @see https://www.w3.org/TR/json-ld/#context-definitions
  prefixes?: { [key: string]: string }
  shapeIri?: string,
  context?: JsonLdContextNormalized,
  nameCallback?: (name: string) => string,
  languages?: Array<string>,
}

export type ObjectMeta = {
  name: string,
  type: string,
  subject: string,
  properties?: Array<PropertyMeta>
}

export type PropertyMeta = {
  name: string,
  predicate: string,
  singular?: boolean,
  required?: boolean,
  referencedTypes?: Array<string>,
  datatype?: string,
  rdfType?: string
}

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