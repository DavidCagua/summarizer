import { OpenAIResponse, SummaryOptions } from '../interfaces';
import { cleanContent } from '../utils/cleanContent';
import { splitContentIntoChunks } from '../utils/splitContent';
import { countTokens } from './helpers';

/**
 * Sends a request to the OpenAI API to summarize a chunk of content.
 *
 * @param {string} chunk - The chunk of content to summarize.
 * @param {SummaryOptions} options - Summary options, including style.
 * @param {string} apiKey - The OpenAI API key.
 * @param {number} maxOutputTokens - The maximum number of tokens for the summary.
 * @returns {Promise<string>} - The generated summary.
 */
export async function generateSummaryForChunk(
  chunk: string,
  options: SummaryOptions,
  apiKey: string,
  maxOutputTokens: number
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Summarize the following content in a ${options.style} tone: ${chunk}` },
      ],
      max_tokens: maxOutputTokens,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error summarizing content: ${response.statusText}`);
  }

  const data: OpenAIResponse = await response.json();
  if (!data.choices || data.choices.length === 0) {
    throw new Error("No summary received from OpenAI.");
  }

  return data.choices[0].message.content.trim();
}

/**
 * Generates a summary of the provided content.
 *
 * @param {string} content - The content to summarize.
 * @param {SummaryOptions} options - The summary options.
 * @param {string} apiKey - The OpenAI API key.
 * @returns {Promise<string>} - The generated summary.
 */
export async function generateSummary(
  content: string,
  options: SummaryOptions,
  apiKey: string
): Promise<string> {
  const maxTokenLimit = 16385;
  const maxOutputTokens = options.word_count || 100; // Tokens for the output summary
  const maxInputTokens = maxTokenLimit - maxOutputTokens; // Input token limit

  const cleanedContent = cleanContent(content); // Clean unnecessary characters
  const contentTokens = countTokens(cleanedContent); // Count the tokens in the content

  // Determine chunks if content exceeds the token limit
  const chunks = contentTokens <= maxInputTokens
    ? [cleanedContent]
    : splitContentIntoChunks(cleanedContent, maxInputTokens, true); // Ensure sentence-safe chunking

  // Summarize each chunk
  const summaries = await Promise.all(
    chunks.map((chunk) =>
      generateSummaryForChunk(chunk, options, apiKey, maxOutputTokens)
    )
  );

  // Join summaries with proper spacing
  return summaries.join('\n\n');
}
