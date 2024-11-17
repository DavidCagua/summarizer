/**
 * Removes HTML tags from the provided content string.
 *
 * @param {string} content - The content string with HTML tags.
 * @returns {string} - The content string without HTML tags.
 */
export function removeHTML(content: string): string {
	return content.replace(/<\/?[^>]+(>|$)/g, "").trim();
  }

  /**
   * Strips non-essential HTML elements like images, ads, and metadata.
   *
   * @param {string} content - The raw HTML content.
   * @returns {string} - The cleaned content with non-essential elements removed.
   */
  export function cleanContent(content: string): string {
	// Remove specific unwanted tags first
	content = content.replace(/<img[^>]*>/g, '');
	content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '');
	content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');
	content = content.replace(/<meta[^>]*>/g, '');
	content = content.replace(/read\s*more\s*<\/a>/gi, '');

	// Then strip remaining HTML tags
	return removeHTML(content);
  }

