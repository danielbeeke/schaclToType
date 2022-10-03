import { Meta } from '../types.ts'

export default function (_values: Array<string>, meta: Meta, [ rawValue ]: Array<any>) {
  const list = rawValue.list.map((item: any) => item.term.value)
  meta.datatype = list.map((item: string) => `'${item}'`).join(' | ')
}