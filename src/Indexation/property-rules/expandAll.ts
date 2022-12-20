import { PropertyMeta } from '../../types.ts'

export default function ([ value ]: Array<any>, meta: PropertyMeta) {
  if (value === 'true') meta.expandAll = true
}