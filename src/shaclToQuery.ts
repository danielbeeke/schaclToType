import { Store } from './deps.ts'
import { Options } from './types.ts'
import { createQuery } from './createQuery.ts'
import { getMetas } from './helpers/getMetas.ts'

export const shaclToQuery = async (shaclStore: Store, options: Options = {}) => {
  const { meta, otherMetas } = await getMetas(shaclStore, options)
  return createQuery(meta, options, otherMetas)
}