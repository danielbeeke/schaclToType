export type ViewMode = {
  'rdf:type': string;
  name: string;
  targetClass: string;
  property: Array<{
    widget: string;
    path: string;
  }>;
}

export const prefixes = {"@vocab":"http://viewmode.danielbeeke.nl/","schema":"https://schema.org/","rdf":"http://www.w3.org/1999/02/22-rdf-syntax-ns#","rdfs":"http://www.w3.org/2000/01/rdf-schema#","sh":"http://www.w3.org/ns/shacl#","xsd":"http://www.w3.org/2001/XMLSchema#","vm":"http://viewmode.danielbeeke.nl/","shsh":"http://www.w3.org/ns/shacl-shacl#","ex":"http://example.com/"};

export const meta = {"targetClass":"http://viewmode.danielbeeke.nl/ViewMode","shapeIri":"http://example.com/ViewMode","properties":[{"predicate":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type","compacted":"rdf:type","singular":true,"required":true,"rdfType":"http://www.w3.org/2001/XMLSchema#string","typeScriptType":"string"},{"predicate":"http://viewmode.danielbeeke.nl/name","compacted":"name","required":true,"singular":true,"rdfType":"http://www.w3.org/2001/XMLSchema#string","typeScriptType":"string"},{"predicate":"http://viewmode.danielbeeke.nl/targetClass","compacted":"targetClass","required":true,"singular":true,"rdfType":"http://www.w3.org/2001/XMLSchema#string","typeScriptType":"string"},{"predicate":"http://viewmode.danielbeeke.nl/property","compacted":"property","required":true,"children":{"shapeIri":"http://example.com/PropertyShape","properties":[{"predicate":"http://viewmode.danielbeeke.nl/widget","compacted":"widget","required":true,"singular":true,"rdfType":"http://www.w3.org/2001/XMLSchema#string","typeScriptType":"string"},{"predicate":"http://viewmode.danielbeeke.nl/path","compacted":"path","required":true,"singular":true,"rdfType":"http://www.w3.org/2001/XMLSchema#string","typeScriptType":"string"}]},"rdfType":"http://example.com/PropertyShape"}],"nestedMetas":[]};