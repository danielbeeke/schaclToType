export type PersonShape = {
  givenName: string,
  familyName: string,
  callSign: Array<string>,
  colleague?: Array<any>,
  description: Array<string>,
  abstract: Array<string>,
  birthDate?: Date,
  gender?: 'female' | 'male',
  address?: Array<AddressShape>
}