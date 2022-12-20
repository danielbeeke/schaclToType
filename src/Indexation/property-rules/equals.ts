import { PropertyMeta } from '../../types.ts'

export default function (values: Array<string>, meta: PropertyMeta, rawValues: Array<any>) {
  if (meta.singular === undefined && values.length === 1) meta.singular = true
  if (meta.required === undefined && values.length === 1) meta.required = true
}