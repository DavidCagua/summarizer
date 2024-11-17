/**
 * Fetches the content of the given URL.
 *
 * @param {string} url - The URL from which to fetch content.
 * @returns {Promise<string>} - A promise that resolves to the content of the URL.
 */
export async function fetchContentFromUrl(url: string): Promise<string> {
	try {
	  const response = await fetch(url);

	  // Check for non-OK statuses (e.g., 404, 500, etc.)
	  if (!response.ok) {
		throw new Error(`Failed to fetch content from URL: ${response.statusText}`);
	  }

	  // Reject URLs returning non-text content (e.g., images, videos)
	  const contentType = response.headers.get('Content-Type');
	  if (!contentType || !contentType.includes('text')) {
		throw new Error('Content is not text-based.');
	  }

	  // Return the text content if valid
	  return await response.text();
	} catch (error) {
	  // Handle errors
	  if (error instanceof Error) {
		throw new Error(`Error fetching content: ${error.message}`);
	  }
	  throw new Error("Unknown error occurred while fetching content.");
	}
  }
