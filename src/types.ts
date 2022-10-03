export type Options = {
  // @see https://www.w3.org/TR/json-ld/#context-definitions
  prefixes?: { [key: string]: string }
}

export type Meta = {
  name: string,
  predicates?: Array<Meta>
  singular?: boolean,
  required?: boolean,
  referencedClasses?: Array<string>,
  datatype?: string
}
