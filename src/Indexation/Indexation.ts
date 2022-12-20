import { RdfObjectLoader, Resource } from '../deps.ts'
import { ObjectMeta, IndexationOptions, PropertyMeta } from '../types.ts'
import { prefixes } from '../helpers/prefixes.ts'
import { Context } from '../Context/Context.ts'

// Rules
import maxCountRule from './property-rules/maxCount.ts'
import minCountRule from './property-rules/minCount.ts'
import typeRule from './property-rules/type.ts'
import orRule from './property-rules/or.ts'
import inRule from './property-rules/in.ts'
import nodeRule from './property-rules/node.ts'
import equalsRule from './property-rules/equals.ts'
import expandAllRule from './property-rules/expandAll.ts'
import fallbackTypeRule from './property-rules/fallbackType.ts'
import aliasRule from './property-rules/alias.ts'

export const runPropertyRules = async (rdfObject: Resource, meta: PropertyMeta, options: IndexationOptions) => {
  const rules: { [key: string]: (values: Array<string>, meta: PropertyMeta, rawValues: Array<any>, options: IndexationOptions) => any} = {
    'sht:expandAll': expandAllRule,
    'sh:minCount': minCountRule,
    'sh:maxCount': maxCountRule,
    'sh:type': typeRule,
    'sh:node': nodeRule,
    'sh:in': inRule,
    'sh:or': orRule,
    'sh:equals': equalsRule,
    'sht:fallbackType': fallbackTypeRule,
    'sht:alias': aliasRule
  }

  for (const [predicateName, ruleHandler] of Object.entries(rules)) {
    /** @ts-ignore */
    const property = rdfObject.properties[ruleHandler.predicate ?? predicateName]
    if (property) {
      const rawValues = [...property.values()]
      const values = rawValues.map(value => value.term.value)

      if (values.length)
        await ruleHandler(values, meta, rawValues, options)
    }
  }
}

export const indexation = async (options: IndexationOptions) => {
  const context = new Context(options.prefixes ?? prefixes)
  if (!options.context) options.context = context

  if (!options.loader) {
    options.loader = new RdfObjectLoader({ context: prefixes })
    await options.loader.importArray(options.shaclStore.getQuads(null, null, null, null))  
  }

  const shapeIri = options.shapeIri ?? Object.keys(options.loader.resources)[0]

  const targetClass = options.loader.resources[shapeIri]?.property['sh:targetClass']?.term.value

  const meta: ObjectMeta = {
    targetClass,
    shapeIri,
    properties: [],
    nestedMetas: []
  }

  options.objectMeta = meta

  for (const shaclProperty of options.loader.resources[shapeIri].properties['sh:property']) {
    const predicate = shaclProperty.property['sh:path']?.value
    const compacted = options.context!.compactIri(predicate, true)
    if (!predicate) continue

    const predicateMeta: PropertyMeta = { 
      predicate,
      compacted
    }
    meta.properties!.push(predicateMeta)

    await runPropertyRules(shaclProperty, predicateMeta, options)
  }

  return meta
}