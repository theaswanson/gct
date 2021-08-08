import { TestBed } from '@angular/core/testing';

import { GctService } from './gct.service';

describe('GctService', () => {
  let service: GctService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GctService);
  });

  describe('when generating a gct', () => {
    let code: string;

    function act(): number[] {
      return service.generate(code);
    }

    describe('given an empty string', () => {
      beforeEach(() => {
        code = '';
      });

      it('throws an error', () => {
        expect(() => act()).toThrowError('Code is empty.');
      });
    });

    describe('given a string with non-hex characters', () => {
      beforeEach(() => {
        code = '1234567890ABCDEFabcdefX';
      });

      it('throws an error', () => {
        expect(() => act()).toThrowError('Code contains invalid characters.');
      });
    });

    describe('given a string with incorrect format', () => {
      beforeEach(() => {
        code = '12345678 1234567';
      });

      it('throws an error', () => {
        expect(() => act()).toThrowError('Invalid code format.');
      });
    });

    describe('given a valid code', () => {
      beforeEach(() => {
        code = '12345678 9ABCDEF0';
      });

      it('returns a gct', () => {
        const actual = act();
        console.log(actual);
        const expected = [0x00, 0xD0, 0xC0, 0xDE, 0x00, 0xD0, 0xC0, 0xDE]
          .concat([0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0])
          .concat([0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        expect(actual).toEqual(expected);
      });
    });
  });
});
