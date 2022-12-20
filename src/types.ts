import { Context } from "./Context/Context.ts"
import { Store, RdfObjectLoader } from './deps.ts'

export type IndexationOptions = {
  prefixes?: { [key: string]: string }
  shapeIri?: string,
  context?: Context,
  shaclStore: Store,
  objectMeta?: ObjectMeta,
  loader?: RdfObjectLoader
}

export type ObjectMeta = {
  targetClass?: string,
  shapeIri: string,
  properties?: Array<PropertyMeta>,
  nestedMetas?: Array<ObjectMeta>
}

export type PropertyMeta = {
  predicate: string,
  compacted: string,
  singular?: boolean,
  alias?: string,
  expandAll?: boolean,
  required?: boolean,
  typeScriptType?: string,
  rdfType?: string,
  children?: ObjectMeta
}

export type RdfJsonTerm = {
  type: 'bnode' | 'uri' | 'literal' | 'defaultgraph',
  value: string,
  lang?: string,
  datatype?: string
}

export type RdfJsonRoot = {
  [key: string]: RdfJsonNode
}

export type RdfJsonNode = {
  [key: string]: Array<RdfJsonTerm  | RdfJsonNode>
}

export type QueryOptions = {
  iris: Array<string>,
  languages: Array<string>
}