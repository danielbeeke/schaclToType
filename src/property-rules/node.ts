import { Options, PropertyMeta } from '../types.ts'

export default function (values: Array<string>, meta: PropertyMeta, _rawValues: any, options: Options) {
  const types = values.map(value => value.split(/\#|\//g).pop()!)
  meta.referencedTypes = values
  meta.datatype = types
    .map(name => options.nameCallback ? options.nameCallback(name) : name)
    .join(' & ')
}