import { PropertyMeta } from '../../types.ts'

export default function ([ value ]: Array<any>, meta: PropertyMeta) {
  if (value === '1') meta.required = true
}