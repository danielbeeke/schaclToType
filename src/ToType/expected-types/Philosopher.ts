export type dboPhilosopher = {
  label: string;
  type: string;
  'dbo:wikiPageID': number;
  alt?: Array<string>;
  birthPlace?: Array<dboLocation>;
  birthDate: Date;
}
export default dboPhilosopher


export type dboLocation = {
  type: any;
  name: string;
}