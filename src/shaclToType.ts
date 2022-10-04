import { Store } from './deps.ts'
import { Options } from './types.ts'
import { template } from './core/template.ts'
import { getMetas } from './helpers/getMetas.ts'

export const shaclToType = async (shaclStore: Store, options: Options = {}): Promise<string> => {
  const { meta, otherMetas } = await getMetas(shaclStore, options)
  return template(meta) + (Object.keys(otherMetas).length ? '\n\n' + Object.values(otherMetas).map(otherMeta => template(otherMeta)).join('\n\n') : '')
}