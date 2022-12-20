import { PropertyMeta, ObjectMeta, QueryOptions } from '../../types.ts'

export class QueryPartBase {
  public property: PropertyMeta
  public nestedMeta?: ObjectMeta
  public meta: ObjectMeta
  public indention: string
  public queryOptions: QueryOptions
  public prefixes: { [key: string]: string }

  constructor (property: PropertyMeta, queryOptions: QueryOptions, meta: ObjectMeta, prefixes: { [key: string]: string }, indention = '  ', nestedMeta?: ObjectMeta) {
    this.property = property
    this.nestedMeta = nestedMeta
    this.meta = meta
    this.indention = indention
    this.queryOptions = queryOptions
    this.prefixes = prefixes
  }

  queryPart (isConstruct = false, previousSubject?: string) {
    const prefix = this.prefix(previousSubject)

    const inner = `${this.indention}?${previousSubject ?? 's'} ${isConstruct ? this.compactedWithMetaSuffix() : this.compacted} ?${prefix} .`

    if (this.property.required || isConstruct) return inner
    return `${this.indention}OPTIONAL {\n${this.indention}${inner}\n${this.indention}}`
  }

  construct (previousSubject?: string) {
    return this.queryPart(true, previousSubject)
  }

  where (previousSubject?: string) {
    return this.queryPart(false, previousSubject)
  }

  prefix (previousSubject?: string) {
    return [previousSubject, this.name].filter(Boolean).join('_').replaceAll(':', '_')
  }

  get name () {
    const compacted = this.property.compacted
    return compacted.replace(/:/g, '')
  }

  get compacted () {
    const compacted = this.property.compacted

    if (this.prefixes[compacted]) return this.prefixes[compacted]

    if (!compacted.includes('://') && compacted.includes(':')) return compacted
    return `<${compacted}>`
  }

  compactedWithMetaSuffix () {
    const compacted = 'empty:' + (this.property.alias ?? this.property.compacted)

    const suffix: Array<string> = []
    suffix.push(this.property.singular ? 'S' : 'M')
    const output = `${compacted}__${suffix.join('')}`
    if (!output.includes('://') && output.includes(':')) return output
    return `<${output}>`
  }
}