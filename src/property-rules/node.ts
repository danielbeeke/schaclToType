import { PropertyMeta } from '../types.ts'

export default function (values: Array<string>, meta: PropertyMeta) {
  const types = values.map(value => value.split(/\#|\//g).pop()!)
  meta.referencedTypes = values
  meta.datatype = types.join(' & ')
}