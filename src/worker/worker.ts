// src/worker/worker.ts

import { RequestData, SummaryOptions, Env } from '../interfaces';
import { fetchContentFromUrl } from '../utils/fetchContent';
import { generateSummary } from '../utils/generateSummary';
import { createErrorResponse, isValidUrl } from '../utils/helpers';

/**
 * Main handler for the Cloudflare Worker.
 * Accepts a URL and summary preferences, retrieves content, and returns a summary.
 *
 * @param {RequestData} request - The request data containing the URL and summary options.
 * @param {Env} env - The environment variables, including the OpenAI API key.
 * @returns {Response} - The response containing the summary or error message.
 */
export default {
	async fetch(request: Request, env: Env): Promise<Response> {
	  try {

		// Check if the request body is present
		if (!request.body) {
		  return createErrorResponse(400, "Bad Request", "Request body is missing or invalid.");
		}

		// Attempt to parse the JSON body
		let requestData: RequestData;
		try {
		  requestData = await request.json();
		} catch (error) {
		  return createErrorResponse(400, "Bad Request", "Request body is missing or invalid.");
		}

		const { url, summary_options }: RequestData = requestData;

		// Validate the URL
		if (!url || !isValidUrl(url)) {
		  const errorResponse = createErrorResponse(400, "Invalid URL", "Please provide a valid URL.");
		  return errorResponse; // Ensure the response is returned
		}

		const content = await fetchContentFromUrl(url);
		const options: SummaryOptions = {
		  word_count: summary_options?.word_count || 100,
		  style: summary_options?.style || "concise",
		};

		// Check if API key is present
		if (!env.OPENAI_API_KEY) {
		  return createErrorResponse(500, "API Key Missing", "OpenAI API key is not configured.");
		}

		const summary = await generateSummary(content, options, env.OPENAI_API_KEY);
		return new Response(JSON.stringify({ summary }), {
		  status: 200,
		  headers: { "Content-Type": "application/json" },
		});
	  } catch (error) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
		return createErrorResponse(500, "Internal Server Error", errorMessage);
	  }
	},
  };




