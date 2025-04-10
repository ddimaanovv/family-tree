export type personType = {
  id: number;
  name: string;
  level: number;
  coordX: number;
  coordY: number;
  seqNumber: number;
  isDirect: boolean;
  birthday: number;
  sibling: Array<number>;
  spouse: Array<number>;
  children: Array<number>;
};
