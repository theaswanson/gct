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
    return this.buildGCTFromString(this.concatAllCodesTogether(this.prepareCodesForGCT(codes)));
  }

  private prepareCodesForGCT(codes: Code[]): Code[] {
    let codesCopy = JSON.parse(JSON.stringify(codes));
    for (let code of codesCopy) {
      code.value = this.removeWhitespace(code.value);
      this.validate(code);
    }
    return codesCopy;
  }

  private removeWhitespace(value: string): string {
    return value.replace(/\s/g, '');
  }

  private concatAllCodesTogether(codes: Code[]): string {
    return codes.map(code => code.value).join('');
  }

  private validate(code: Code) {
    if (code.value === undefined) {
      throw new Error(`Code for '${code.name}' is undefined.`);
    }

    if (code.value.length === 0) {
      throw new Error(`Code for '${code.name}' is empty.`);
    }

    if (!/^[0-9A-Fa-f]*$/.test(code.value)) {
      throw new Error(`Code for '${code.name}' contains invalid characters.`);
    }

    if (code.value.length % 16 !== 0) {
      throw new Error(`Invalid code format for '${code.name}'.`);
    }
  }

  private buildGCTFromString(code: string): number[] {
    return this.buildGCTFromBytes(this.stringToHex(code));
  }

  private buildGCTFromBytes(bytes: number[]): number[] {
    return this.header.concat(bytes).concat(this.terminator);
  }

  private stringToHex(value: string): number[] {
    let bytes = [];
    for (let i = 0; i < value.length; i += 2) {
      bytes.push(parseInt(value.substring(i, i + 2), 16));
    }
    return bytes;
  }
}
