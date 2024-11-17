/**
 * Fetches the content of the given URL.
 *
 * @param {string} url - The URL from which to fetch content.
 * @returns {Promise<string>} - A promise that resolves to the content of the URL.
 */
export async function fetchContentFromUrl(url: string): Promise<string> {
	try {
	  const response = await fetch(url);
	  if (!response.ok) {
		throw new Error(`Failed to fetch content from URL: ${response.statusText}`);
	  }
	  return await response.text();
	} catch (error) {
	  if (error instanceof Error) {
		throw new Error(`Error fetching content: ${error.message}`);
	  }
	  throw new Error("Unknown error occurred while fetching content.");
	}
  }
