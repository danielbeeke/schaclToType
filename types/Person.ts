export type Person = {
  givenName: string,
  familyName: string,
  callSign: Array<string>,
  colleague?: Array<any>,
  description: Array<string>,
  abstract: Array<string>,
  birthDate?: Date,
  gender?: 'female' | 'male',
  address?: Array<Address>
}


export type Address = {
  type: any,
  streetAddress: string,
  addressRegion: string,
  addressLocality: string,
  postalCode: string | number,
  addressCountry: string
}
