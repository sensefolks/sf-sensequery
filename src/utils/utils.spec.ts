import { isValidKey } from './utils';

describe('isValidKey', () => {
  it('returns false for undefined key', () => {
    expect(isValidKey(undefined)).toEqual(false);
  });

  it('returns false for empty string', () => {
    expect(isValidKey('')).toEqual(false);
  });

  it('returns false for whitespace string', () => {
    expect(isValidKey('   ')).toEqual(false);
  });

  it('returns true for valid key', () => {
    expect(isValidKey('valid-key')).toEqual(true);
  });
});
