import { QueryPartBase } from './QueryPartBase.ts'
import { createQueryParts } from '../ToQuery.ts'

export class Nested extends QueryPartBase {

  construct (previousSubject?: string) {
    const prefix = this.prefix(previousSubject)

    const queryParts = createQueryParts(this.nestedMeta!, this.queryOptions, this.prefixes, this.indention)
    const nestedWheres = queryParts.map(queryPart => queryPart.construct(prefix)).join('\n') as string

    const inner = `${this.indention}?${previousSubject ?? 's'} ${this.compactedWithMetaSuffix()} ?${prefix} .\n`
    return inner + nestedWheres
  }

  where (previousSubject?: string): string {
    const prefix = this.prefix(previousSubject)

    const queryParts = createQueryParts(this.nestedMeta!, this.queryOptions, this.prefixes, this.indention + '  ')
    const nestedWheres = queryParts.map(queryPart => queryPart.where(prefix)).join('\n') as string

    const inner = `${this.indention}?${previousSubject ?? 's'} ${this.compacted} ?${prefix} .\n`
    if (this.property.required) return inner + nestedWheres
    return `${this.indention}OPTIONAL {\n${this.indention}${inner + nestedWheres}\n${this.indention}}`
  }

}