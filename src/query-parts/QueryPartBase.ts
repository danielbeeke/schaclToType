import { Options, PropertyMeta, ObjectMeta } from '../types.ts'

export class QueryPartBase {
  public property: PropertyMeta
  public options: Options
  public nestedTypes: { [key: string]: ObjectMeta }
  public meta: ObjectMeta

  constructor (property: PropertyMeta, options: Options, nestedTypes: { [key: string]: ObjectMeta }, meta: ObjectMeta) {
    this.property = property
    this.options = options
    this.nestedTypes = nestedTypes
    this.meta = meta
  }

  queryPart (isConstruct = false, previousSubject?: string) {
    const prefix = this.prefix(previousSubject)

    const comment = `\n\t# ${prefix}\n`
    let inner = `\t?${previousSubject ?? 's'} ${this.property.compacted} ?${prefix} .`

    if (this.property.predicate === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' && !isConstruct) {
      inner += `\n\tFILTER (?${prefix} IN (<${this.meta.type}>))`
    }

    if (this.property.required || isConstruct) return comment + inner
    return comment + `\tOPTIONAL {\n\t${inner}\n\t}`
  }

  construct (previousSubject?: string) {
    return this.queryPart(true, previousSubject)
  }

  where (previousSubject?: string) {
    return this.queryPart(false, previousSubject)
  }

  prefix (previousSubject?: string) {
    return [previousSubject, this.property.name].filter(Boolean).join('_').replaceAll(':', '_')
  }
}