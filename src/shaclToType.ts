import { Store } from './deps.ts'
import { ObjectMeta, Options } from './types.ts'
import { indexation } from './indexation.ts'
import { template } from './template.ts'

export const shaclToType = async (shaclStore: Store, options: Options = {}): Promise<string> => {
  const meta: ObjectMeta = await indexation(shaclStore, options)

  const otherTypes = await Promise.all(meta.properties!.flatMap(property => property.referencedTypes).filter(Boolean)
  .map(shapeIri => shaclToType(shaclStore, Object.assign({ shapeIri }, options))))
  
  return template(meta) + (otherTypes.length ? '\n\n' + otherTypes.join('\n\n') : '')
}