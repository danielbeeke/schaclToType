import { QueryPartBase } from './QueryPartBase.ts'
import { createQueryParts } from '../core/createQuery.ts'

export class Nested extends QueryPartBase {

  construct (previousSubject?: string) {
    const prefix = this.prefix(previousSubject)
    const nestedType = this.nestedTypes[this.property.referencedTypes![0]]
    const queryParts = createQueryParts(nestedType, this.options, this.nestedTypes)
    const nestedWheres = queryParts.map(queryPart => queryPart.construct(this.property.name)).join('\n') as string

    const comment = `\n\t# ${prefix}\n`
    const inner = `\t?${previousSubject ?? 's'} ${this.options.context!.compactIri(this.property.predicate)} ?${prefix} .`
    return comment + inner + nestedWheres
  }

  where (previousSubject?: string) {
    const prefix = this.prefix(previousSubject)
    const nestedType = this.nestedTypes[this.property.referencedTypes![0]]
    const queryParts = createQueryParts(nestedType, this.options, this.nestedTypes)
    const nestedWheres = queryParts.map(queryPart => queryPart.where(this.property.name)).join('\n') as string

    const comment = `\n\t# ${prefix}\n`
    const inner = `\t?${previousSubject ?? 's'} ${this.options.context!.compactIri(this.property.predicate)} ?${prefix} .`
    if (this.property.required) return comment + inner + nestedWheres
    return comment + `\tOPTIONAL {\n\t${inner + nestedWheres}\n\t}`
  }

}