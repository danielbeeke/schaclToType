import { Store, RdfObjectLoader, JsonLdContextNormalized, Resource } from './deps.ts'
import { ObjectMeta, Options, PropertyMeta } from './types.ts'
import { prefixes } from './helpers/prefixes.ts'

// Rules
import maxCount from './property-rules/maxCount.ts'
import minCount from './property-rules/minCount.ts'
import datatype from './property-rules/datatype.ts'
import or from './property-rules/or.ts'
import inRule from './property-rules/in.ts'
import node from './property-rules/node.ts'

export const runPropertyRules = (rdfObject: Resource, meta: PropertyMeta, context: JsonLdContextNormalized) => {
  const rules: { [key: string]: (values: Array<string>, meta: PropertyMeta, rawValues: Array<any>, context: JsonLdContextNormalized) => any} = {
    minCount,
    maxCount,
    datatype,
    node,
    'in': inRule,
    or,
  }

  for (const [predicate, ruleHandler] of Object.entries(rules)) {
    if (rdfObject.properties[`sh:${predicate}`]) {
      const rawValues = [...rdfObject.properties[`sh:${predicate}`].values()]
      const values = rawValues.map(value => value.term.value)

      if (values.length)
        ruleHandler(values, meta, rawValues, context)
    }
  }
}

const predicateSkipList = [
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
]

export const indexation = async (shaclStore: Store, options: Options) => {
  const loader = new RdfObjectLoader({ context: prefixes })
  await loader.importArray(shaclStore.getQuads(null, null, null, null))
  const subject = options.shapeIri ?? Object.keys(loader.resources)[0]
  const context = new JsonLdContextNormalized(options.prefixes ?? {})

  const meta: ObjectMeta = {
    name: subject.split(/\#|\//g).pop()!,
    properties: []
  }

  for (const shaclProperty of loader.resources[subject].properties['sh:property']) {
    if (predicateSkipList.includes(shaclProperty.property['sh:path']?.value)) continue

    const name = context.compactIri(shaclProperty.property['sh:path']?.value ?? '', true)
    const predicateMeta: PropertyMeta = { name }
    meta.properties!.push(predicateMeta)

    runPropertyRules(shaclProperty, predicateMeta, context)
  }

  return meta
}