import { describe, it, expect } from "vitest";
import { removeHTML, cleanContent } from "../src/utils/cleanContent";

describe("cleanContent.ts", () => {
  // Test cases for removeHTML
  describe("removeHTML", () => {
    it("should remove all HTML tags from a string", () => {
      const input = "<p>Hello <strong>World</strong>!</p>";
      const expected = "Hello World!";
      expect(removeHTML(input)).toBe(expected);
    });

    it("should return an empty string if the input only contains HTML tags", () => {
      const input = "<div><span></span></div>";
      const expected = "";
      expect(removeHTML(input)).toBe(expected);
    });

    it("should handle strings with no HTML tags", () => {
      const input = "Plain text without tags.";
      const expected = "Plain text without tags.";
      expect(removeHTML(input)).toBe(expected);
    });
  });

  // Test cases for cleanContent
  describe("cleanContent", () => {
    it("should remove images, scripts, styles, and metadata tags", () => {
      const input = `
        <html>
          <head>
            <meta charset="UTF-8">
            <style>body { color: red; }</style>
          </head>
          <body>
            <script>alert("Hi!");</script>
            <img src="image.jpg" alt="Example">
            <p>Hello World!</p>
          </body>
        </html>`;
      const expected = "Hello World!";
      expect(cleanContent(input)).toBe(expected);
    });

    it("should remove 'read more' links", () => {
      const input = `
        <p>This is an article.</p>
        <a href="/read-more">read more</a>`;
      const expected = "This is an article.";
      expect(cleanContent(input)).toBe(expected);
    });

    it("should clean content with nested tags and inline styles/scripts", () => {
      const input = `
        <div>
          <p style="color: blue;">Hello <span>World</span></p>
          <script>console.log("test");</script>
          <style>div { background: white; }</style>
        </div>`;
      const expected = "Hello World";
      expect(cleanContent(input)).toBe(expected);
    });

    it("should return an empty string for empty or non-content input", () => {
      const input = "<img src='image.jpg'><script></script>";
      const expected = "";
      expect(cleanContent(input)).toBe(expected);
    });
  });
});
