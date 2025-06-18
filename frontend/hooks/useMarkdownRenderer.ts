"use client";

import { useEffect, useState } from "react";
import { Marked } from "marked";
import markedShiki from "marked-shiki";
import { createHighlighter, bundledLanguages } from "shiki";
import DOMPurify from "dompurify";

const darkTheme = "monokai";
const lightTheme = "one-light";

// You may want to parameterize theme/langs for your use case
const highlighterPromise = createHighlighter({
  // TODO: can be used to import highlighting for all languages, but it slows things down considerably
  // langs: Object.keys(bundledLanguages),
  langs: ["js", "ts", "tsx", "md", "python", "js", "bash", "json"],
  themes: [lightTheme, darkTheme],
});

export function useMarkdownRenderer(markdown: string, theme: string): string {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    async function renderMarkdown() {
      const highlighter = await highlighterPromise;
      const marked = new Marked().use(
        markedShiki({
          highlight(code, lang, props) {
            return highlighter.codeToHtml(code, {
              lang,
              theme: theme === "dark" ? darkTheme : lightTheme,
              meta: { __raw: props.join(" ") },
              transformers: [
                {
                  code(node) {
                    node.properties["data-language"] = lang;
                  },
                },
              ],
            });
          },
        }),
      );
      const rawHtml = await marked.parse(markdown);
      const cleanHtml = DOMPurify.sanitize(rawHtml);
      if (isMounted) setHtml(cleanHtml);
    }
    renderMarkdown();
    return () => {
      isMounted = false;
    };
  }, [markdown, theme]);

  return html;
}
