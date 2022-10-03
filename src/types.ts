export type Options = {
  // @see https://www.w3.org/TR/json-ld/#context-definitions
  prefixes?: { [key: string]: string }
  shapeIri?: string
}

export type ObjectMeta = {
  name: string,
  properties?: Array<PropertyMeta>
}

export type PropertyMeta = {
  name: string,
  singular?: boolean,
  required?: boolean,
  referencedTypes?: Array<string>,
  datatype?: string
}
