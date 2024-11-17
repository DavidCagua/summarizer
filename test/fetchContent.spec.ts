import { fetchContentFromUrl } from "../src/utils/fetchContent"; // Adjust the path as necessary
import { vi, describe, it, expect, afterEach } from "vitest";

global.fetch = vi.fn();

describe("fetchContentFromUrl", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return content when the fetch is successful", async () => {
    const mockContent = "Hello, World!";
    (fetch as vi.Mock).mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(mockContent),
    });

    const url = "https://example.com";
    const result = await fetchContentFromUrl(url);

    expect(result).toBe(mockContent);
    expect(fetch).toHaveBeenCalledWith(url);
  });

  it("should throw an error when fetch returns a non-OK status", async () => {
    (fetch as vi.Mock).mockResolvedValue({
      ok: false,
      statusText: "Not Found",
    });

    const url = "https://example.com";
    await expect(fetchContentFromUrl(url)).rejects.toThrow(
      "Failed to fetch content from URL: Not Found"
    );
    expect(fetch).toHaveBeenCalledWith(url);
  });

  it("should throw an error when fetch itself throws an error", async () => {
    const errorMessage = "Network Error";
    (fetch as vi.Mock).mockRejectedValue(new Error(errorMessage));

    const url = "https://example.com";
    await expect(fetchContentFromUrl(url)).rejects.toThrow(
      `Error fetching content: ${errorMessage}`
    );
    expect(fetch).toHaveBeenCalledWith(url);
  });

  it("should throw a generic error for unknown errors", async () => {
    (fetch as vi.Mock).mockRejectedValue("Unknown error");

    const url = "https://example.com";
    await expect(fetchContentFromUrl(url)).rejects.toThrow(
      "Unknown error occurred while fetching content."
    );
    expect(fetch).toHaveBeenCalledWith(url);
  });
});
