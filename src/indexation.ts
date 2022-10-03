import { Store, RdfObjectLoader, JsonLdContextNormalized, Resource } from './deps.ts'
import { Meta, Options } from './types.ts'
import { prefixes } from './helpers/prefixes.ts'

// Rules
import maxCount from './rules/maxCount.ts'
import minCount from './rules/minCount.ts'
import classRule from './rules/class.ts'
import datatype from './rules/datatype.ts'
import or from './rules/or.ts'
import inRule from './rules/in.ts'
import node from './rules/node.ts'

export const runPropertyRules = (rdfObject: Resource, meta: Meta, context: JsonLdContextNormalized) => {
  const rules: { [key: string]: (values: Array<string>, meta: Meta, rawValues: Array<any>, context: JsonLdContextNormalized) => any} = {
    'class': classRule,
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

export const indexation = async (shaclStore: Store, options: Options) => {
  const loader = new RdfObjectLoader({ context: prefixes })
  await loader.importArray(shaclStore.getQuads(null, null, null, null))
  const firstSubject = Object.keys(loader.resources)[0]
  const context = new JsonLdContextNormalized(options.prefixes ?? {})

  const meta: Meta = {
    name: firstSubject.split(/\#|\//g).pop()!,
    predicates: []
  }

  for (const shaclProperty of loader.resources[firstSubject].properties['sh:property']) {
    const name = context.compactIri(shaclProperty.property['sh:path']?.value ?? '', true)
    const predicateMeta: Meta = { name, predicates: [] }
    meta.predicates!.push(predicateMeta)

    runPropertyRules(shaclProperty, predicateMeta, context)
  }

  return meta
}