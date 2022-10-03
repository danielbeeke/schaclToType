import { PropertyMeta } from '../types.ts'

const datatypeMapping: { [key: string]: string } = {
  'http://www.w3.org/2001/XMLSchema#string': 'string',
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString': 'string',
  'http://www.w3.org/2001/XMLSchema#date': 'Date',
  'http://www.w3.org/2001/XMLSchema#integer': 'number'
}

export default function ([ value ]: Array<any>, meta: PropertyMeta) {
  meta.datatype = datatypeMapping[value]

  if (!meta.datatype && meta.referencedTypes?.length) 
    meta.datatype = meta.referencedTypes.join(' & ')
}