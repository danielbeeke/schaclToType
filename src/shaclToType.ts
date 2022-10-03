import { Store } from './deps.ts'
import { Meta, Options } from './types.ts'
import { indexation } from './indexation.ts'

export const shaclToType = async (shaclStore: Store, options: Options = {}) => {
  const meta: Meta = await indexation(shaclStore, options)

  return `export type ${meta.name} = {
${meta.predicates!.map(predicate => {
  const name = /\:|\-/g.test(predicate.name) ? `'${predicate.name}'` : predicate.name
  const datatype = predicate.singular ? predicate.datatype ?? 'any' : `Array<${predicate.datatype ?? 'any'}>`

  return `  ${name}${predicate.required ? '' : '?'}: ${datatype}`
}).join(',\n')}
}`
}