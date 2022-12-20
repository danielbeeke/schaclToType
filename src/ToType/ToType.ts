import { IndexationOptions, ObjectMeta, PropertyMeta } from '../types.ts'
import { NamedNode } from '../deps.ts'

const metaToName = (meta: ObjectMeta, options: IndexationOptions) => {
  const iri = meta.targetClass ?? meta.shapeIri
  return iriToName(iri, options)
}

const iriToName = (iri: string, options: IndexationOptions) => {
  return options.context!.compactIri(iri, true)
    .replace(/:/g, '')
}

const propertyToName = (property: PropertyMeta, options: IndexationOptions) => {
  const compactedPredicate = property.alias ?? options.context!.compactIri(property.predicate, true)
  return /\:|\-/g.test(compactedPredicate) ? `'${compactedPredicate}'` : compactedPredicate
}

export const ToType = (meta: ObjectMeta, options: IndexationOptions) => {
  const mainType = template(meta, options, true)
  const otherTypes = meta.nestedMetas!.map(nestedMeta => template(nestedMeta, options)).join('\n\n')
  return (mainType + '\n' + otherTypes).trim()
}

export const template = (meta: ObjectMeta, options: IndexationOptions, exportAsDefault = false) => {
  const name = metaToName(meta, options)

return `export type ${name} = {
${propertiesTemplate(meta.properties!, options)}
}${exportAsDefault ? `
export default ${name}
` : ''}`
}

const propertiesTemplate = (properties: Array<PropertyMeta>, options: IndexationOptions, indention = '  '): string => {
  return properties.map(property => {
    const propertyName = propertyToName(property, options)
    let nestedType = null

    if (property.children) {
      nestedType = `${!property.singular ? `Array<` : ''}{\n${propertiesTemplate(property.children.properties!, options, indention + '  ')}\n  }${!property.singular ? `>` : ''}`
    }

    if (!property.typeScriptType && property.rdfType?.startsWith('http')) {
      const [ quad ] = options.shaclStore.getQuads(new NamedNode(property.rdfType), new NamedNode('http://www.w3.org/ns/shacl#targetClass'), null, null)
      if (quad) {
        const compactedTargetType = options.context!.compactIri(quad.object.value, true)
        const nestedTypeName = iriToName(compactedTargetType, options)
        nestedType = property.singular ? nestedTypeName : `Array<${nestedTypeName}>`  
      }
    }

    const type = nestedType ?? property.typeScriptType ?? 'any'
    return `${indention}${propertyName}${property.required ? '' : '?'}: ${type};`
  }).join('\n')
}
