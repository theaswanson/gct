import { Injectable } from '@angular/core';
import { Code } from './Code';

@Injectable({
  providedIn: 'root'
})
export class GctService {

  header = [0x00, 0xD0, 0xC0, 0xDE, 0x00, 0xD0, 0xC0, 0xDE];
  terminator = [0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
  
  constructor() { }

  generate(codes: Code[]): number[] {
    let allCodes = '';
    for (let code of codes) {
      let codeText = code?.value;
      if (codeText === undefined) {
        throw new Error(`Code for '${code.name}' is undefined.`);
      }
      codeText = codeText.replace(/\s/g, '');
      this.validate(codeText, code.name);
      allCodes = allCodes.concat(codeText);
    }
    return this.gct(allCodes);
  }

  private validate(code: string, name: string) {
    if (code.length === 0) {
      throw new Error(`Code for '${name}' is empty.`);
    }

    if (!/^[0-9A-Fa-f]*$/.test(code)) {
      throw new Error(`Code for '${name}' contains invalid characters.`);
    }

    if (code.length % 16 !== 0) {
      throw new Error(`Invalid code format for '${name}'.`);
    }
  }

  private gct(code: string): number[] {
    let bytes = this.toHex(code);
    return this.buildGCT(bytes);
  }

  private toHex(value: string): number[] {
    let bytes = [];
    for (let i = 0; i < value.length; i += 2) {
      let byte = parseInt(value.substring(i, i + 2), 16);
      bytes.push(byte);
    }
    return bytes;
  }

  private buildGCT(bytes: number[]): number[] {
    return this.header.concat(bytes).concat(this.terminator);
  }
}
