export type Person = {
  givenName: string;
  familyName: string;
  callSign: string;
  colleague?: any;
  description: string;
  abstract: string;
  birthDate?: Date;
  gender?: 'female' | 'male';
  address?: Array<PostalAddress>;
}

export type PostalAddress = {
  'rdf:type': string;
  streetAddress: string;
  addressRegion: string;
  addressLocality: string;
  postalCode: string | number;
  addressCountry: string;
}

export const prefixes = {"@vocab":"https://schema.org/","dash":"http://datashapes.org/dash#","rdf":"http://www.w3.org/1999/02/22-rdf-syntax-ns#","rdfs":"http://www.w3.org/2000/01/rdf-schema#","schema":"https://schema.org/","sh":"http://www.w3.org/ns/shacl#","xsd":"http://www.w3.org/2001/XMLSchema#","ex":"http://example.com/"};

export const meta = {"targetClass":"https://schema.org/Person","shapeIri":"http://example.com/PersonShape","properties":[{"predicate":"https://schema.org/givenName","compacted":"givenName","required":true,"singular":true,"typeScriptType":"string","rdfType":"http://www.w3.org/2001/XMLSchema#string"},{"predicate":"https://schema.org/familyName","compacted":"familyName","required":true,"singular":true,"rdfType":"http://www.w3.org/2001/XMLSchema#string","typeScriptType":"string"},{"predicate":"https://schema.org/callSign","compacted":"callSign","required":true,"rdfType":"http://www.w3.org/1999/02/22-rdf-syntax-ns#langString","typeScriptType":"string"},{"predicate":"https://schema.org/colleague","compacted":"colleague","rdfType":"http://www.w3.org/2001/XMLSchema#string"},{"predicate":"https://schema.org/description","compacted":"description","required":true,"rdfType":"http://www.w3.org/2001/XMLSchema#string","typeScriptType":"string"},{"predicate":"https://schema.org/abstract","compacted":"abstract","required":true,"rdfType":"http://www.w3.org/2001/XMLSchema#string","typeScriptType":"string"},{"predicate":"https://schema.org/birthDate","compacted":"birthDate","singular":true,"rdfType":"http://www.w3.org/2001/XMLSchema#date","typeScriptType":"Date"},{"predicate":"https://schema.org/gender","compacted":"gender","singular":true,"typeScriptType":"'female' | 'male'","rdfType":"http://www.w3.org/2001/XMLSchema#string"},{"predicate":"https://schema.org/address","compacted":"address","rdfType":"http://example.com/AddressShape"}],"nestedMetas":[{"shapeIri":"http://example.com/AddressShape","targetClass":"https://schema.org/PostalAddress","properties":[{"predicate":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type","compacted":"rdf:type","required":true,"singular":true,"rdfType":"http://www.w3.org/2001/XMLSchema#string","typeScriptType":"string"},{"predicate":"https://schema.org/streetAddress","compacted":"streetAddress","required":true,"singular":true,"rdfType":"http://www.w3.org/2001/XMLSchema#string","typeScriptType":"string"},{"predicate":"https://schema.org/addressRegion","compacted":"addressRegion","required":true,"singular":true,"rdfType":"http://www.w3.org/2001/XMLSchema#string","typeScriptType":"string"},{"predicate":"https://schema.org/addressLocality","compacted":"addressLocality","required":true,"singular":true,"rdfType":"http://www.w3.org/2001/XMLSchema#string","typeScriptType":"string"},{"predicate":"https://schema.org/postalCode","compacted":"postalCode","required":true,"singular":true,"typeScriptType":"string | number","rdfType":"http://www.w3.org/2001/XMLSchema#string"},{"predicate":"https://schema.org/addressCountry","compacted":"addressCountry","required":true,"singular":true,"rdfType":"http://www.w3.org/2001/XMLSchema#string","typeScriptType":"string"}]}]};