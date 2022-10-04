import { Store, JsonLdContextNormalized } from '../deps.ts'
import { Options, ObjectMeta } from '../types.ts'
import { indexation } from '../core/indexation.ts'

export const getMetas = async (shaclStore: Store, options: Options = {}) => {
  options.context = new JsonLdContextNormalized(options.prefixes ?? {})
  const meta: ObjectMeta = await indexation(shaclStore, options)

  const otherMetas: { [key: string]: ObjectMeta } = {}
  const otherTypes = meta.properties!.flatMap(property => property.referencedTypes).filter(Boolean)
  for (const otherType of otherTypes) {
    otherMetas[otherType!] = await indexation(shaclStore, Object.assign({ shapeIri: otherType }, options))
  }

  return { meta, otherMetas }
}