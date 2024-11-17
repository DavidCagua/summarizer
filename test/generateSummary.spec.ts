import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateSummary } from '../src/utils/generateSummary';
import { cleanContent } from '../src/utils/cleanContent';
import { splitContentIntoChunks } from '../src/utils/splitContent';
import { countTokens } from '../src/utils/helpers';

// Mock dependencies
vi.mock('../src/utils/cleanContent');
vi.mock('../src/utils/splitContent');
vi.mock('../src/utils/helpers');

describe('generateSummary', () => {
  const mockApiKey = 'mock-api-key';
  const mockContent = 'This is a long piece of content that will be summarized.';
  const mockOptions = { style: 'concise', word_count: 50 };

  // Set up mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();  // Reset all mocks
    (splitContentIntoChunks as vi.Mock).mockReturnValue(['chunk1', 'chunk2']); // Mock splitContentIntoChunks here
    (cleanContent as vi.Mock).mockReturnValue(mockContent); // Mock cleanContent here
    (countTokens as vi.Mock).mockReturnValue(15000);  // Mock countTokens to return a value that will trigger chunking
  });

  it('should handle API errors gracefully', async () => {
    // Mock token counting
    (countTokens as vi.Mock).mockReturnValue(5000);  // Set a token value that won't trigger chunking

    // Mock content splitting into chunks
    (splitContentIntoChunks as vi.Mock).mockReturnValue([mockContent]); // No chunking needed

    // Mock the API failure
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
      json: vi.fn().mockResolvedValue({}),
    });

    await expect(generateSummary(mockContent, mockOptions, mockApiKey))
      .rejects
      .toThrowError('Error summarizing content: Internal Server Error');
  });

  it('should return a single chunk summary when content fits within the token limit', async () => {
    (countTokens as vi.Mock).mockReturnValue(1000); // Content fits within token limit
    (splitContentIntoChunks as vi.Mock).mockReturnValue([mockContent]); // No chunking needed

    const mockApiResponse = { choices: [{ message: { content: 'Concise summary' } }] };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      statusText: 'OK',
      json: vi.fn().mockResolvedValue(mockApiResponse),
    });

    const result = await generateSummary(mockContent, mockOptions, mockApiKey);

    expect(result).toBe('Concise summary');
  });
});
