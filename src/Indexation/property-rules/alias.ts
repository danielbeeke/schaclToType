import { PropertyMeta, IndexationOptions } from '../../types.ts'

export default function ([ value ]: Array<any>, meta: PropertyMeta, _rawValues: any, options: IndexationOptions) {
  meta.alias = options.context?.compactIri(value, true)
}