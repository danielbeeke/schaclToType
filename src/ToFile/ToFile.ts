import { IndexationOptions, ObjectMeta } from '../types.ts'
import { ToType } from '../ToType/ToType.ts'
import { createConstructQuery } from '../ToQuery/ToQuery.ts'
import { prefixes } from '../helpers/prefixes.ts'

export const ToFile = (meta: ObjectMeta, options: IndexationOptions) => {
  const types = ToType(meta, options)
  const queryOptions = { 
    iris: ['<urn:replace>'], 
    languages: ['en'] // TODO language replacements. :(
  }

  const query = createConstructQuery(meta, queryOptions, Object.assign({}, { '@vocab': prefixes.dbp}, prefixes), `\${values}`)

  return `${types}
  export const query = (iris: Array<string>) => {  
    const values = \`VALUES ?s { \${iris.map(iri => iri.includes('://') ? \`<\${iri}>\` : iri).join(' ')} }\`
    return \`${query}\`}
  `
}