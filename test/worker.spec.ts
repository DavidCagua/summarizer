import { expect, vi, test, describe } from 'vitest';
import { fetchContentFromUrl } from '../src/utils/fetchContent';
import { generateSummary } from '../src/utils/generateSummary';
import { isValidUrl } from '../src/utils/helpers';
import worker from '../src/worker/worker';
import { RequestData, Env  } from '../src/interfaces';

// Mock the utility functions used in the worker
vi.mock('../src/utils/fetchContent');
vi.mock('../src/utils/generateSummary');
// vi.mock('../src/utils/helpers');

// Define the interfaces
interface WorkerResponse {
  summary?: string;
  error?: {
    code: number;
    message: string;
    more_info?: string;
  };
}

describe('Cloudflare Worker', () => {
  const env: Env = { OPENAI_API_KEY: 'test-api-key' };

  let mockedFetchContentFromUrl = vi.fn().mockResolvedValue('Example content from the URL');
  // let mockedGenerateSummary = vi.fn().mockResolvedValue('Generated summary text');
  let mockedIsValidUrl = vi.fn().mockReturnValue(true);




	test('should return an error if URL is invalid', async () => {
		const requestData: RequestData = {
			url: 'invalid-url',
			summary_options: { word_count: 100, style: 'concise' },
		};

		mockedIsValidUrl.mockReturnValue(false);

		const request = new Request('https://worker.example.com', {
			method: 'POST',
			body: JSON.stringify(requestData),
			headers: { 'Content-Type': 'application/json' },
		});

		// Await the worker's fetch response
		const response = await worker.fetch(request, env);

		// Check if the response is defined
		console.log('Response:', response);  // Should not be undefined if the worker function completes properly

		if (response) {
			const responseBody: WorkerResponse = await response.json();
			expect(response.status).toBe(400);
			expect(responseBody.error?.message).toBe('Invalid URL');
			expect(responseBody.error?.more_info).toBe('Please provide a valid URL.');
		} else {
			console.log('Response is undefined');
		}
	});




  test('should return an error if OpenAI API key is missing', async () => {
    const requestData: RequestData = {
      url: 'https://example.com',
      summary_options: { word_count: 100, style: 'concise' },
    };

    const request = new Request('https://worker.example.com', {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await worker.fetch(request, { OPENAI_API_KEY: '' });

    const responseBody: WorkerResponse = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error?.message).toBe('API Key Missing');
    expect(responseBody.error?.more_info).toBe('OpenAI API key is not configured.');
  });


  test('should return an error for missing request body', async () => {
    const request = new Request('https://worker.example.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await worker.fetch(request, env);

    const responseBody: WorkerResponse = await response.json();
		console.log(responseBody);

    expect(response.status).toBe(400);
    expect(responseBody.error?.message).toBe('Bad Request');
    expect(responseBody.error?.more_info).toBe('Request body is missing or invalid.');
  });
});
