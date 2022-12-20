export type dboPhilosopher = {
  'rdfs:label': string;
  'rdf:type': string;
  'dbo:wikiPageID': number;
  alt?: string;
  birthPlace?: Array<dboLocation>;
  birthDate: Date;
}

export type dboLocation = {
  'rdf:type': Array<string>;
  name: string;
}

export const prefixes = {"@vocab":"http://dbpedia.org/property/","rdf":"http://www.w3.org/1999/02/22-rdf-syntax-ns#","rdfs":"http://www.w3.org/2000/01/rdf-schema#","sh":"http://www.w3.org/ns/shacl#","xsd":"http://www.w3.org/2001/XMLSchema#","dbp":"http://dbpedia.org/property/","dbo":"http://dbpedia.org/ontology/","ex":"http://example.com/"};

export const meta = {"targetClass":"http://dbpedia.org/ontology/Philosopher","shapeIri":"http://example.com/PhilosopherShape","properties":[{"predicate":"http://www.w3.org/2000/01/rdf-schema#label","compacted":"rdfs:label","required":true,"singular":true,"rdfType":"http://www.w3.org/1999/02/22-rdf-syntax-ns#langString","typeScriptType":"string"},{"predicate":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type","compacted":"rdf:type","required":true,"singular":true,"rdfType":"http://www.w3.org/2001/XMLSchema#string","typeScriptType":"string"},{"predicate":"http://dbpedia.org/ontology/wikiPageID","compacted":"dbo:wikiPageID","required":true,"singular":true,"rdfType":"http://www.w3.org/2001/XMLSchema#integer","typeScriptType":"number"},{"predicate":"http://dbpedia.org/property/alt","compacted":"alt","rdfType":"http://www.w3.org/1999/02/22-rdf-syntax-ns#langString","typeScriptType":"string"},{"predicate":"http://dbpedia.org/property/birthPlace","compacted":"birthPlace","rdfType":"http://example.com/LocationShape"},{"predicate":"http://dbpedia.org/property/birthDate","compacted":"birthDate","required":true,"singular":true,"rdfType":"http://www.w3.org/2001/XMLSchema#date","typeScriptType":"Date"}],"nestedMetas":[{"shapeIri":"http://example.com/LocationShape","targetClass":"http://dbpedia.org/ontology/Location","properties":[{"predicate":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type","compacted":"rdf:type","required":true,"rdfType":"http://www.w3.org/2001/XMLSchema#string","typeScriptType":"Array<string>"},{"predicate":"http://dbpedia.org/property/name","compacted":"name","required":true,"singular":true,"rdfType":"http://www.w3.org/1999/02/22-rdf-syntax-ns#langString","typeScriptType":"string"}]}]};