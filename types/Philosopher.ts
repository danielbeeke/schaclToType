export type Philosopher = {
  name: string,
  'rdf:type': Array<any>,
  alt?: Array<string>,
  birthPlace?: Array<Location>,
  birthDate: Date
}


export type Location = {
  'rdf:type': Array<any>,
  name: string
}
