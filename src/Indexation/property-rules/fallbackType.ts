import { IndexationOptions, PropertyMeta } from '../../types.ts'

const rdfString = 'http://www.w3.org/2001/XMLSchema#string'

const fallbackTypeHandler = function (values: Array<any>, meta: PropertyMeta, _rawValues: any, options: IndexationOptions) {
  if (!meta.rdfType) meta.rdfType = rdfString

  if (!meta.typeScriptType && meta.singular && meta.rdfType === rdfString) {
    meta.typeScriptType = 'string'
  }

  if (!meta.singular && meta.typeScriptType && !meta.typeScriptType?.includes('Array')) {
    meta.typeScriptType = `Array<${meta.typeScriptType}>`
  }
}

// We use sh:path because that predicate is always available.
fallbackTypeHandler.predicate = 'sh:path'

export default fallbackTypeHandler