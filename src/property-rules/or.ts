import { Options, PropertyMeta } from '../types.ts'
import { Resource } from '../deps.ts'
import { runPropertyRules } from '../core/indexation.ts'

export default function (_values: Array<string>, meta: PropertyMeta, rawValues: Array<any>, options: Options) {
  for (const rawValue of rawValues) {
    const predicate = rawValue.property['http://www.w3.org/1999/02/22-rdf-syntax-ns#first'].predicates[0].term.value
    const rule: keyof PropertyMeta = predicate.split(/\#|\//g).pop()!

    const orItems = rawValue.list.map((object: Resource) => {
      const valueMeta: PropertyMeta = Object.assign({}, meta)
      runPropertyRules(object, valueMeta, options)
      return valueMeta
    }).map((valueMeta: PropertyMeta) => valueMeta[rule])
    
    const orItemsSet = [...new Set(orItems)]

    /** @ts-ignore */
    meta[rule] = orItemsSet.join(' | ')!
  }


}