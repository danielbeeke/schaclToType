export type Philosopher = {
  name: string,
  type: Array<any>,
  'dbo:wikiPageID': number,
  alt?: Array<string>,
  birthPlace?: Array<Location>,
  birthDate: Date
}


export type Location = {
  type: Array<any>,
  name: string
}
