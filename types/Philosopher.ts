export type Philosopher = {
  name: string,
  alt?: Array<string>,
  birthPlace?: Array<Location>,
  birthDate: Date
}

export type Location = {
  name: string
}