<!DOCTYPE html>
<html lang="en">
<body>
  <h1>Cloudflare Worker with OpenAI Integration</h1>
  <p>
    This project is a Cloudflare Worker that provides summarized content from a given URL. It integrates with the OpenAI API to generate summaries with customizable options.
  </p>
  
  <h2>Features</h2>
  <ul>
    <li><strong>OpenAI Integration:</strong> Generates concise summaries from the content of a given URL.</li>
    <li><strong>Error Handling:</strong> Provides detailed error messages for invalid input or missing configurations.</li>
    <li><strong>Development and Production Environments:</strong> Supports environment-specific behavior.</li>
  </ul>
  
  <h2>Prerequisites</h2>
  <ol>
    <li><strong>Node.js and npm:</strong> Install <a href="https://nodejs.org/" target="_blank">Node.js</a> (LTS version recommended).</li>
    <li><strong>Wrangler:</strong> Install the Cloudflare Workers CLI:
      <pre><code>npm install -g wrangler</code></pre>
    </li>
    <li><strong>Cloudflare Account:</strong> <a href="https://www.cloudflare.com/" target="_blank">Sign up for Cloudflare</a> and set up Workers.</li>
  </ol>
  
  <h2>Setup</h2>
  
  <h3>1. Clone the Repository</h3>
  <pre><code>git clone [https://github.com/your-repo-url](https://github.com/DavidCagua/summarizer.git)
cd summarizer
</code></pre>
  
  <h3>2. Install Dependencies</h3>
  <pre><code>npm install</code></pre>
  
  <h3>3. Configure <code>wrangler.toml</code></h3>
  <p>A template <code>wrangler.toml</code> file is provided in the repository. Update it as needed:</p>
  <pre><code>:schema node_modules/wrangler/config-schema.json
name = "summarizer"
main = "src/worker/worker.ts"
compatibility_date = "2024-11-12"
compatibility_flags = ["nodejs_compat"]

#[vars]
#OPENAI_API_KEY = "example-secret"

[observability]
enabled = true
</code></pre>
  <p>Note:</p>
  <ul>
    <li><code>name</code>: The name of your worker.</li>
    <li><code>main</code>: Entry point of your worker script.</li>
    <li><code>compatibility_date</code>: Specify the date to use the latest Workers runtime updates.</li>
    <li><code>observability</code>: Enables Workers Logs for monitoring.</li>
    <li>To use secrets like <code>OPENAI_API_KEY</code>, configure them separately with Wrangler commands (see below).</li>
  </ul>
  
  
  <h3>4. Set Environment Variables</h3>
  <p>Use <code>wrangler</code> to set the OpenAI API key:</p>
  <pre><code>wrangler secret put OPENAI_API_KEY --env production
wrangler secret put OPENAI_API_KEY --env dev
</code></pre>
  
  <h2>Development</h2>
  <p>Run the worker locally:</p>
  <pre><code>wrangler dev</code></pre>
  
  <h3>Development Notes</h3>
  <ul>
    <li>The <code>OPENAI_API_KEY</code> must be set in your development environment for API calls to function.</li>
    <li>Modify code in the <code>src</code> folder to make changes to your worker.</li>
  </ul>
  
  <h2>Deployment</h2>
  
  <h3>Deploy to Production</h3>
  <pre><code>wrangler deploy </code></pre>
  <h2>Testing</h2>
  
  <h3>Unit Testing with Vitest</h3>
  <p>This project uses <a href="https://vitest.dev/" target="_blank">Vitest</a> for testing. To run the tests:</p>
  <pre><code>npm run test</code></pre>
  
  <h3>Example Test Command</h3>
  <p>Ensure the tests pass before deploying:</p>
  <pre><code>npx vitest</code></pre>
  
  <h3>Writing Tests</h3>
  <p>Add your test files in the <code>src/tests</code> directory. Example test file structure:</p>
  <pre><code>src/
  ├── worker/
  │   └── worker.ts
  ├── utils/
  │   └── helpers.ts
  └── tests/
      └── worker.test.ts
</code></pre>
  
  <h3>Mocking Environment Variables</h3>
  <p>When writing tests, you can mock environment variables like <code>OPENAI_API_KEY</code> to simulate production or development conditions.</p>
  <pre><code>import { describe, test, expect } from "vitest";

describe("Worker Tests", () => {
  test("should return a valid summary", async () => {
    const env = { OPENAI_API_KEY: "mock-key" };
    const response = await someWorkerFunction(request, env);
    expect(response.status).toBe(200);
  });
});
</code></pre>
  
  <h3>Example Test Output</h3>
  <pre><code> PASS  src/tests/worker.test.ts
 ✓ should return a valid summary (20ms)
</code></pre>
  <h2>CI/CD</h2>
  <p>Continuous Deployment is handled automatically by Cloudflare upon updating the main branch of the repo.
  
  <h2>Testing</h2>
  
  <h3>Local Testing</h3>
  <p>Run the worker locally with:</p>
  <pre><code>wrangler dev</code></pre>
  
  <h3>Example Request</h3>
  <pre><code>curl -X POST https://summarizer.dfcaguazango.workers.dev/\
  -H "Content-Type: application/json" \
  -d '{
        "url": "https://example.com",
        "summary_options": {
          "word_count": 100,
          "style": "concise"
        }
      }'
</code></pre>
  
  <h3>Example Response</h3>
  <pre><code>{
  "summary": "This is a concise summary of the content at the given URL."
}
</code></pre>
  
  <h2>Notes</h2>
  <ul>
    <li><strong>Error Handling:</strong> The worker validates input and returns detailed error messages when issues occur.</li>
    <li><strong>Environment Variables:</strong> Ensure <code>OPENAI_API_KEY</code> is set in all environments.</li>
  </ul>
</body>
</html>
