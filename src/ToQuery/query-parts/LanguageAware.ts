import { QueryPartBase } from './QueryPartBase.ts'

export class LanguageAware extends QueryPartBase {

  construct (previousSubject?: string) {
    const { languages } = this.queryOptions
    return `${languages.length ? this.queryPart(true, previousSubject) : ''}`
  }

  where (previousSubject?: string) {
    const prefix = this.prefix(previousSubject)
    const { languages } = this.queryOptions

    return `${languages.length ? `${languages.map(
      (language: string) => `${this.indention}OPTIONAL {?${previousSubject ?? 's'} ${this.compacted} ?${prefix}_${language} .
${this.indention}FILTER (lang(?${prefix}_${language}) = '${language}') }`).join('\n')}
${this.indention}BIND(COALESCE(${languages.map(language => `?${prefix}_${language}`).join(', ')}) as ?${prefix})` : ''}`
  }
}