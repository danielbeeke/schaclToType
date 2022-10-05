import { Store, RdfObjectLoader, Resource } from '../deps.ts'
import { ObjectMeta, Options, PropertyMeta } from '../types.ts'
import { prefixes } from '../helpers/prefixes.ts'

// Rules
import maxCountRule from '../property-rules/maxCount.ts'
import minCountRule from '../property-rules/minCount.ts'
import datatypeRule from '../property-rules/datatype.ts'
import orRule from '../property-rules/or.ts'
import inRule from '../property-rules/in.ts'
import nodeRule from '../property-rules/node.ts'

export const runPropertyRules = (rdfObject: Resource, meta: PropertyMeta, options: Options) => {
  const rules: { [key: string]: (values: Array<string>, meta: PropertyMeta, rawValues: Array<any>, options: Options) => any} = {
    'minCount': minCountRule,
    'maxCount': maxCountRule,
    'datatype': datatypeRule,
    'node': nodeRule,
    'in': inRule,
    'or': orRule,
  }

  for (const [predicate, ruleHandler] of Object.entries(rules)) {
    if (rdfObject.properties[`sh:${predicate}`]) {
      const rawValues = [...rdfObject.properties[`sh:${predicate}`].values()]
      const values = rawValues.map(value => value.term.value)

      if (values.length)
        ruleHandler(values, meta, rawValues, options)
    }
  }
}

export const indexation = async (shaclStore: Store, options: Options) => {
  const loader = new RdfObjectLoader({ context: prefixes })
  await loader.importArray(shaclStore.getQuads(null, null, null, null))
  const subject = options.shapeIri ?? Object.keys(loader.resources)[0]

  const name = subject.split(/\#|\//g).pop()!

  const type = loader.resources[subject].property['sh:targetClass'].term.value

  const meta: ObjectMeta = {
    name: options.nameCallback ? options.nameCallback(name) : name,
    subject,
    type,
    properties: []
  }

  for (const shaclProperty of loader.resources[subject].properties['sh:property']) {
    const predicate = shaclProperty.property['sh:path']?.value

    const propertyIri = shaclProperty.property['sh:path']?.value
    const propertyName = options.context!.compactIri(propertyIri, true)
    const propertyNameCompacted = options.context!.compactIri(propertyIri)

    const typeName = propertyName === 'a' ? 'type' : propertyName

    const predicateMeta: PropertyMeta = { 
      name: propertyName, 
      predicate, 
      typeName,
      compacted: propertyNameCompacted 
    }
    meta.properties!.push(predicateMeta)

    runPropertyRules(shaclProperty, predicateMeta, options)
  }

  return meta
}