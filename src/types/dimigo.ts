export interface IIdentity {
  // eslint-disable-next-line camelcase
  user_type: 'S' | 'T' | 'D' | 'G' | 'P';
  email: string;
  name: string;
  idx: number;
  id: string;
  klass: number;
  photo: string;
  grade: number;
  number: number;
  serial: number;
}
