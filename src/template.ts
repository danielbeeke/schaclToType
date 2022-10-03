import { ObjectMeta } from "./types.ts";

export const template = (meta: ObjectMeta) => {

  return `export type ${meta.name} = {
${meta.properties!.map(property => {
  const name = /\:|\-/g.test(property.name) ? `'${property.name}'` : property.name
  const datatype = property.singular ? property.datatype ?? 'any' : `Array<${property.datatype ?? 'any'}>`

  return `  ${name}${property.required ? '' : '?'}: ${datatype}`
}).join(',\n')}
}`
}