import { SearxngClient } from "@agentic/searxng";
import axios from "axios";
import * as cheerio from "cheerio";

async function main() {
  const searxng = new SearxngClient();
  const res = await searxng.search({
    query: "latest updates in iran israel conflict",
    engines: ["google"],
  });
  const limRes = res.results.slice(0, 3);

  /**
   * Fetches the content of a website and returns its main text content.
   * @param url The website URL to crawl.
   * @returns The main text content of the website as a string.
   */
  async function crawlAndExtractText(url: string): Promise<string> {
    try {
      // Fetch the HTML
      const response = await axios.get(url);
      const html = response.data;

      // Parse the HTML and extract text
      const $ = cheerio.load(html);
      // Remove script and style tags to get clean text
      $("script, style").remove();
      // Extract text from the body
      const text = $("body").text();

      return text;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch ${url}: ${error.message}`);
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }

  // Example usage
  limRes.forEach((res) => {
    const targetUrl = res.url; // Replace with your target URL
    crawlAndExtractText(targetUrl)
      .then((text) => console.log(text))
      .catch((error) => console.error(error));
  });
}

main();
