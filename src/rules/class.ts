import { Meta } from '../types.ts'

export default function (values: Array<string>, meta: Meta) {
  if (values?.length) 
    meta.referencedClasses = values.map(value => value.split(/\#|\//g).pop()!)
}