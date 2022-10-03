import { Meta } from '../types.ts'

export default function ([ value ]: Array<any>, meta: Meta) {
  if (value === '1') meta.singular = true
}