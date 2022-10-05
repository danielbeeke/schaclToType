import { Store } from './deps.ts'
import { Options } from './types.ts'
import { template } from './core/template.ts'
import { getMetas } from './helpers/getMetas.ts'
import { createQuery } from './core/createQuery.ts'

export const shaclToFrontendFile = async (shaclStore: Store, options: Options = {}): Promise<string> => {
  const { meta, otherMetas } = await getMetas(shaclStore, options)
  const types = template(meta, true) + (Object.keys(otherMetas).length ? '\n\n' + Object.values(otherMetas).map(otherMeta => template(otherMeta)).join('\n\n') : '')
  const query = "export const query = `\n" + createQuery(meta, options, otherMetas) + "`"
  const allMetas = { [meta.type]: meta, ...otherMetas }

  const frontendMeta: { [key: string]: { [key: string]: { singular: boolean, type: string } } } = {}
  for (const [iri, meta] of Object.entries(allMetas)) {
    const compactedIri = options.context!.compactIri(iri, true)
    if (!frontendMeta[compactedIri]) frontendMeta[compactedIri] = {}

    for (const property of meta.properties!) {
      const compactedProperty = options.context!.compactIri(property.name, true)

      frontendMeta[compactedIri][compactedProperty] = {
        singular: property.singular ?? false,
        type: property.datatype! ?? 'string'  
      }
    }
  }

  return `export const prefixes = ${JSON.stringify(options.context!.getContextRaw())}
export const meta = ${JSON.stringify(frontendMeta)}
${query}
${types}
    `    
}