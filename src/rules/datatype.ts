import { Meta } from '../types.ts'

const datatypeMapping: { [key: string]: string } = {
  'http://www.w3.org/2001/XMLSchema#string': 'string',
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString': 'string',
  'http://www.w3.org/2001/XMLSchema#date': 'Date'
}

export default function ([ value ]: Array<any>, meta: Meta) {
  meta.datatype = datatypeMapping[value]

  if (!meta.datatype && meta.referencedClasses?.length) 
    meta.datatype = meta.referencedClasses.join(' & ')
}