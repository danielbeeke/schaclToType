import { PropertyMeta } from '../types.ts'

export default function (_values: Array<string>, meta: PropertyMeta, [ rawValue ]: Array<any>) {
  const list = rawValue.list.map((item: any) => item.term.value)
  meta.datatype = list.map((item: string) => `'${item}'`).join(' | ')
}