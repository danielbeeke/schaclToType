import { ObjectMeta } from './types.ts'

export const template = (meta: ObjectMeta, defaultExport = false) => {

  return `export type ${meta.name} = {
${meta.properties!.map(property => {
  const name = /\:|\-/g.test(property.name) ? `'${property.name}'` : property.name
  const type = property.singular ? property.datatype ?? 'any' : `Array<${property.datatype ?? 'any'}>`

  return `  ${name}${property.required ? '' : '?'}: ${type}`
}).join(',\n')}
}${defaultExport ? `
export default ${meta.name}
`: ''}
`
}