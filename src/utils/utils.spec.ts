import { isValidKey, formatErrorMessage } from './utils';

describe('isValidKey', () => {
  it('returns false for undefined key', () => {
    expect(isValidKey(undefined)).toEqual(false);
  });

  it('returns false for null key', () => {
    expect(isValidKey(null)).toEqual(false);
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

describe('formatErrorMessage', () => {
  it('returns the string directly if given a string', () => {
    expect(formatErrorMessage('Error message')).toEqual('Error message');
  });

  it('returns the error message if given an Error object', () => {
    const error = new Error('Test error');
    expect(formatErrorMessage(error)).toEqual('Test error');
  });

  it('returns a default message for other types', () => {
    expect(formatErrorMessage(null)).toEqual('An unknown error occurred');
    expect(formatErrorMessage(undefined)).toEqual('An unknown error occurred');
    expect(formatErrorMessage({})).toEqual('An unknown error occurred');
  });
});
