import { ObjectMeta, Options } from '../types.ts'
import { LanguageAware } from '../query-parts/LanguageAware.ts'
import { QueryPartBase } from '../query-parts/QueryPartBase.ts'
import { Nested } from '../query-parts/Nested.ts'

export const createQueryParts = (meta: ObjectMeta, options: Options, nestedTypes: { [key: string]: ObjectMeta } = {}) => {
  return meta.properties!.map(property => {
    if (property.referencedTypes) return new Nested(property, options, nestedTypes, meta)
    if (property.rdfType === 'rdf:langString') return new LanguageAware(property, options, nestedTypes, meta)
    return new QueryPartBase(property, options, nestedTypes, meta)
  })
}

export const createQuery = (meta: ObjectMeta, options: Options, nestedTypes: { [key: string]: ObjectMeta } = {}) => {
  const queryParts = createQueryParts(meta, options, nestedTypes)
  const prefixes = Object.entries(options.context!.getContextRaw())
    .filter(([_alias, uri]) => uri.includes('://'))
    .map(([alias, uri]) => alias[0] === '@' ? '' : `PREFIX ${alias}: <${uri}>`).filter(Boolean).join('\n')

return `${prefixes}

CONSTRUCT {
\t?s a <http://subject.com/subject> .
\n${queryParts.map(queryPart => queryPart.construct()).join('\n')}\n}
WHERE {\n\tVALUES ?s { }
${queryParts.map(queryPart => queryPart.where()).join('\n')}
}
`
}