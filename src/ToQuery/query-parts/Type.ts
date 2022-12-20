import { QueryPartBase } from './QueryPartBase.ts'

export class Type extends QueryPartBase {
  where (previousSubject?: string) {
    return `${this.queryPart(false, previousSubject)}\n${this.indention}FILTER(?${this.prefix(previousSubject)} = <${this.meta.targetClass}>)`
  }
}