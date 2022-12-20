import { IndexationOptions, PropertyMeta } from '../../types.ts'
import { indexation } from '../Indexation.ts'

export default async function (values: Array<string>, meta: PropertyMeta, _rawValues: any, options: IndexationOptions) {
  const [ shapeIri ] = values

  const targetClass = options.loader!.resources[shapeIri]?.property['sh:targetClass']?.term.value

  if (options.objectMeta?.shapeIri !== shapeIri) {
    const childMeta = await indexation({ ...options, shapeIri })
    if (childMeta.properties) {
      if (targetClass) {
        options.objectMeta!.nestedMetas!.push({ shapeIri, targetClass, properties: childMeta.properties })
      }
      else {
        meta.children = { shapeIri, properties: childMeta.properties }
      }
    }  
  }

  meta.rdfType = shapeIri
}