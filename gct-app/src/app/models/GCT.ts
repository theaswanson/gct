import { Code } from "./Code";

export class GCT {
  gameId: string;
  codes: Code[];

  constructor() {
    this.gameId = '';
    this.codes = [{name: 'New Code'} as Code];
  }
}
