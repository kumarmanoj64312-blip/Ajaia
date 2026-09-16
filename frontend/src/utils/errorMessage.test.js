import { describe, expect, test } from 'vitest';
import { getErrorMessage } from './errorMessage';

describe('getErrorMessage', () => {
  test('prefers the API-provided message', () => {
    const error = { response: { data: { message: 'Document not found' } } };
    expect(getErrorMessage(error)).toBe('Document not found');
  });

  test('falls back to error.message when there is no response body', () => {
    const error = new Error('Network Error');
    expect(getErrorMessage(error)).toBe('Network Error');
  });

  test('falls back to the provided default when nothing else is available', () => {
    expect(getErrorMessage({}, 'Custom fallback')).toBe('Custom fallback');
  });
});
