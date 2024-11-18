import { RequestData, SummaryOptions, Env } from "../interfaces";
import { fetchContentFromUrl } from "../utils/fetchContent";
import { generateSummary } from "../utils/generateSummary";
import { createErrorResponse, isValidUrl } from "../utils/helpers";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const { pathname } = new URL(request.url);

      // Use rate limiter
      const limitResult = await env.RATE_LIMITER.limit({ key: pathname });
		console.log(limitResult)
      if (!limitResult.success) {
        return createErrorResponse(
          429,
          "Too Many Requests",
          `Rate limit exceeded for ${pathname}`
        );
      }

      // Only allow POST requests
      if (request.method !== "POST") {
        return createErrorResponse(405, "Method Not Allowed", "Only POST requests are allowed.");
      }

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
        return createErrorResponse(400, "Invalid URL", "Please provide a valid URL.");
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
