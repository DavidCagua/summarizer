// src/utils/splitContent.ts
import { countTokens } from '../utils/helpers';

/**
 * Splits the content into chunks based on natural boundaries (paragraphs).
 *
 * @param {string} content - The content to be split into chunks.
 * @param {number} maxTokens - The maximum number of tokens per chunk.
 * @returns {string[]} - An array of chunks.
 */
export function splitContentIntoChunks(
	content: string,
	maxTokens: number,
	respectSentences = false
  ): string[] {
	if (!respectSentences) {
	  // Default split based on token count
	  return content.match(new RegExp(`(.|\\s){1,${maxTokens}}`, 'g')) || [];
	}
	console.log('hola');

	const sentences = content.split(/(?<=[.!?])\s+/); // Split by sentence
	const chunks: string[] = [];
	let currentChunk = '';

	for (const sentence of sentences) {
	  const sentenceTokens = countTokens(sentence);
	  if (countTokens(currentChunk) + sentenceTokens <= maxTokens) {
		currentChunk += ` ${sentence}`;
	  } else {
		chunks.push(currentChunk.trim());
		currentChunk = sentence;
	  }
	}

	if (currentChunk) chunks.push(currentChunk.trim());
	return chunks;
  }

