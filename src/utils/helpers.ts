/**
 * Utility function to return structured error responses.
 *
 * @param {number} code - The HTTP status code for the error.
 * @param {string} message - The error message to be returned.
 * @param {string} moreInfo - Optional additional information about the error.
 * @returns {Response} - The structured error response.
 */
export function createErrorResponse(code: number, message: string, moreInfo?: string): Response {

  const responseBody = JSON.stringify({
    error: {
      code,
      message,
      more_info: moreInfo || "",
    },
  });
  return new Response(responseBody, { status: code, headers: { 'Content-Type': 'application/json' } });
}




/**
 * Validates if the provided string is a valid URL.
 *
 * @param {string} string - The URL to validate.
 * @returns {boolean} - Returns `true` if the URL is valid, otherwise `false`.
 */
export function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    const hostname = url.hostname;

    // Check if the URL has a scheme (http:// or https://)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    // Reject local addresses (localhost, 127.x.x.x, private IP ranges)
    if (
      hostname === 'localhost' ||
      /^127\./.test(hostname) ||
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname)
    ) {
      return false;
    }

    // Reject URL shorteners (e.g., bit.ly, goo.gl)
    const shortenerDomains = ['bit.ly', 'goo.gl', 't.co'];
    if (shortenerDomains.includes(hostname)) {
      return false;
    }

    return true;
  } catch (_) {
    return false;
  }
}


  /**
 * Estimates the number of tokens in a given text.
 *
 * @param {string} text - The text whose token count is to be estimated.
 * @returns {number} - The estimated token count.
 */
  export function countTokens(text: string): number {
	// If the text is empty, return 0 tokens
	if (!text.trim()) {
	  return 0;
	}

	// Remove excessive spaces (collapse multiple spaces into one and trim)
	const cleanedText = text.trim().replace(/\s+/g, ' ');

	// Token count based on the assumption that each word is a token.
	const tokens = cleanedText.split(' ').length;

	// Multiply by 1.3 to account for average token size and round up
	return Math.max(1, Math.ceil(tokens * 1.3)); // Ensure at least 1 token is counted
  }
