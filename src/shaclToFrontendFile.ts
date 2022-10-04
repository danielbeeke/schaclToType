import { Store } from './deps.ts'
import { Options } from './types.ts'
import { template } from './core/template.ts'
import { getMetas } from './helpers/getMetas.ts'
import { createQuery } from './core/createQuery.ts'
import { transpile } from 'https://deno.land/x/ts_serve@v1.4.1/utils/transpile.ts'

export const shaclToFrontendFile = async (shaclStore: Store, options: Options = {}, fileType: 'js' | 'ts' | 'd.ts'): Promise<string> => {
  const { meta, otherMetas } = await getMetas(shaclStore, options)
  const types = template(meta, true) + (Object.keys(otherMetas).length ? '\n\n' + Object.values(otherMetas).map(otherMeta => template(otherMeta)).join('\n\n') : '')
  const query = "export const query = `\n" + createQuery(meta, options, otherMetas) + "`"
  const allMetas = { [meta.type]: meta, ...otherMetas }

  const frontendMeta: { [key: string]: { [key: string]: { singular: boolean, type: string } } } = {}
  for (const [iri, meta] of Object.entries(allMetas)) {
    const compactedIri = options.context!.compactIri(iri, true)

    if (!frontendMeta[compactedIri]) frontendMeta[compactedIri] = {}

    for (const property of meta.properties!) {
      frontendMeta[compactedIri][property.name] = {
        singular: property.singular ?? false,
        type: property.datatype! ?? 'string'  
      }
    }
  }

  const dir = new URL('.', import.meta.url).pathname;
  const helpers = await Deno.readTextFile(dir + '/frontend-helpers.ts')
  const javascript = await transpile(helpers, new URL("file:///src.ts"))


  if (fileType === 'js') {
    return `
      ${query}
      ${javascript.split('//# sourceMappingURL')[0]}
      export const prefixes = ${JSON.stringify(options.context!.getContextRaw())}
      export const meta = ${JSON.stringify(frontendMeta)}
      export const get = (endpoint, uris) => getter(query, endpoint, uris, prefixes, meta)
    `
  }

  if (fileType === 'd.ts') {
    return `
      ${types}
      export function get (endpoint: string, uris: Array<string>): Array<${meta.name}>
    `
  }

  if (fileType === 'ts') {
    return `
      import { getter } from 'https://deno.land/x/shacl_to_type/frontend-helpers.ts'
      export const prefixes = ${JSON.stringify(options.context!.getContextRaw())}
      export const meta = ${JSON.stringify(frontendMeta)}
      ${types}
      ${query}
      export const get = (endpoint: string, uris: Array<string>) => getter<${meta.name}>(query, endpoint, uris, prefixes, meta)
    `    
  }

  return ''
}