import { QueryPartBase } from './QueryPartBase.ts'

export class LanguageAware extends QueryPartBase {

  where (previousSubject?: string) {
    const prefix = [previousSubject, this.property.name].filter(Boolean).join('_').replaceAll(':', '_')

return `\n\t# ${this.property.name}
${this.options.languages!.map(language => `\tOPTIONAL {
\t\t?${previousSubject ?? 's'} ${this.options.context!.compactIri(this.property.predicate)} ?${prefix}_${language} .
\t\tFILTER (lang(?${prefix}_${language}) = '${language}')
\t}`).join('\n')}
\tBIND(COALESCE(${this.options.languages!.map(language => `?${prefix}_${language}`).join(', ')}) as ?${prefix})
`
  }
}