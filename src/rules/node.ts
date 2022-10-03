import { Meta } from '../types.ts'

export default function (values: Array<string>, meta: Meta) {
  const types = values.map(value => value.split(/\#|\//g).pop()!)
  meta.datatype = types.join(' & ')
}