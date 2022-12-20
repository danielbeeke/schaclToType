import { IndexationOptions, PropertyMeta } from '../../types.ts'

const datatypeMapping: { [key: string]: string } = {
  'http://www.w3.org/2001/XMLSchema#string': 'string',
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString': 'string',
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#string': 'string',
  'http://www.w3.org/2001/XMLSchema#date': 'Date',
  'http://www.w3.org/2001/XMLSchema#integer': 'number',
  'http://www.w3.org/2001/XMLSchema#number': 'number'
}

const typeHandler = function ([ value ]: Array<any>, meta: PropertyMeta, _rawValues: any, options: IndexationOptions) {
  meta.rdfType = value

  if (!datatypeMapping[value]) console.log(value)

  if (datatypeMapping[value]) meta.typeScriptType = datatypeMapping[value]
}

typeHandler.predicate = 'sh:datatype'

export default typeHandler