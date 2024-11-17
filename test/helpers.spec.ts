import { describe, it, expect, vi } from 'vitest';
import { createErrorResponse, isValidUrl, countTokens } from '../src/utils/helpers';

describe('helpers.ts', () => {

  describe('createErrorResponse', () => {
    it('should return a structured error response with the correct status and message', async () => {
      const code = 400;
      const message = 'Bad Request';
      const moreInfo = 'The provided data was invalid';

      const response = createErrorResponse(code, message, moreInfo);

      // Check status code
      expect(response.status).toBe(code);

      // Check headers
      expect(response.headers.get('Content-Type')).toBe('application/json');

      // Read the response body and check its content
      const responseBody = await response.text();  // Convert stream to text
      const parsedBody = JSON.parse(responseBody); // Parse JSON string to object

      expect(parsedBody.error).toEqual({
        code,
        message,
        more_info: moreInfo,
      });
    });

    it('should return the correct response even when moreInfo is not provided', async () => {
      const code = 404;
      const message = 'Not Found';

      const response = createErrorResponse(code, message);

      const responseBody = await response.text();  // Convert stream to text
      const parsedBody = JSON.parse(responseBody); // Parse JSON string to object

      expect(parsedBody.error).toEqual({
        code,
        message,
        more_info: '',
      });
    });
  });

  describe('isValidUrl', () => {
    it('should return true for a valid URL', () => {
      const validUrl = 'https://example.com';
      expect(isValidUrl(validUrl)).toBe(true);
    });

    it('should return false for an invalid URL', () => {
      const invalidUrl = 'htp://invalid-url';
      expect(isValidUrl(invalidUrl)).toBe(false);
    });

    it('should return false for an empty string', () => {
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('countTokens', () => {
		it('should return the correct number of tokens for a single word', () => {
			const text = 'Hello';
			expect(countTokens(text)).toBe(2); // 1 word, 1 * 1.3 = 1.3, rounded up to 2
		});

		it('should return the correct number of tokens for multiple words', () => {
			const text = 'Hello world';
			expect(countTokens(text)).toBe(3); // 2 words, 2 * 1.3 = 2.6, rounded up to 3
		});

		it('should return the correct number of tokens for text with extra spaces', () => {
			const text = 'Hello    world    ';
			expect(countTokens(text)).toBe(3); // 2 words, extra spaces should be collapsed
		});

		it('should return 0 for an empty string', () => {
			const text = '';
			expect(countTokens(text)).toBe(0); // Empty string should return 0 tokens
		});

		it('should return the correct number of tokens for long text', () => {
			const text = 'This is a much longer text with more words to count';
			expect(countTokens(text)).toBe(15);
		});

		it('should return the correct number of tokens for a very large text', () => {
			const text = ' '.repeat(10000) + 'word'; // A string with 10000 spaces followed by a single word
			expect(countTokens(text)).toBe(2); // Only one word after all the spaces
		});
  });

});
