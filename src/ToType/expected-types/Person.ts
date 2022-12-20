export type Person = {
  givenName: string;
  familyName: string;
  callSign: string;
  colleague?: any;
  description: string;
  abstract: Array<string>;
  birthDate?: Date;
  gender?: 'female' | 'male';
  address?: Array<PostalAddress>;
}
export default Person


export type PostalAddress = {
  type: string;
  streetAddress: string;
  addressRegion: string;
  addressLocality: string;
  postalCode: string | number;
  addressCountry: string;
}