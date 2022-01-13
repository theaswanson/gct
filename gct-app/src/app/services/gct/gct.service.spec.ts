import { TestBed } from '@angular/core/testing';
import { Code } from 'src/app/models/Code';

import { GctService } from './gct.service';

describe('GctService', () => {
  let service: GctService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GctService);
  });

  describe('when generating a gct', () => {
    let codes: Code[];

    function act(): number[] {
      return service.generate(codes);
    }

    describe('given an empty string', () => {
      beforeEach(() => {
        codes = [{ name: 'empty string', value: '' } as Code];
      });

      it('throws an error', () => {
        expect(() => act()).toThrowError('Code for \'empty string\' is empty.');
      });
    });

    describe('given a string with non-hex characters', () => {
      beforeEach(() => {
        codes = [{ name: 'string with non-hex characters', value: '1234567890ABCDEFabcdefX' } as Code];
      });

      it('throws an error', () => {
        expect(() => act()).toThrowError('Code for \'string with non-hex characters\' contains invalid characters.');
      });
    });

    describe('given a string with incorrect format', () => {
      beforeEach(() => {
        codes = [{ name: 'string with incorrect format', value: '12345678 1234567' } as Code];
      });

      it('throws an error', () => {
        expect(() => act()).toThrowError('Invalid code format for \'string with incorrect format\'.');
      });
    });

    describe('given a valid code', () => {
      beforeEach(() => {
        codes = [{ value: '12345678 9ABCDEF0' } as Code];
      });

      it('does not modify the original codes', () => {
        act();
        expect(codes[0].value).toEqual('12345678 9ABCDEF0');
      })

      it('returns a gct', () => {
        const actual = act();
        const expected = [0x00, 0xD0, 0xC0, 0xDE, 0x00, 0xD0, 0xC0, 0xDE]
          .concat([0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0])
          .concat([0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        expect(actual).toEqual(expected);
      });
    });

    describe('given two valid codes', () => {
      beforeEach(() => {
        codes = [
          { value: '12345678 9ABCDEF0' } as Code,
          { value: '12345678 9ABCDEF0' } as Code
        ];
      });

      it('returns a gct', () => {
        const actual = act();
        const expected = [0x00, 0xD0, 0xC0, 0xDE, 0x00, 0xD0, 0xC0, 0xDE]
          .concat([0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0])
          .concat([0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0])
          .concat([0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        expect(actual).toEqual(expected);
      });
    });
  });
});
