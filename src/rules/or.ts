import { Meta } from '../types.ts'
import { JsonLdContextNormalized, Resource } from '../deps.ts'
import { runPropertyRules } from '../indexation.ts'

export default function (_values: Array<string>, meta: Meta, rawValues: Array<any>, context: JsonLdContextNormalized) {
  for (const rawValue of rawValues) {
    const predicate = rawValue.property['http://www.w3.org/1999/02/22-rdf-syntax-ns#first'].predicates[0].term.value
    const rule: keyof Meta = predicate.split(/\#|\//g).pop()!

    const orItems = rawValue.list.map((object: Resource) => {
      const valueMeta: Meta = Object.assign({}, meta)
      runPropertyRules(object, valueMeta, context)
      return valueMeta
    }).map((valueMeta: Meta) => valueMeta[rule])
    
    const orItemsSet = [...new Set(orItems)]

    /** @ts-ignore */
    meta[rule] = orItemsSet.join(' | ')!
  }


}