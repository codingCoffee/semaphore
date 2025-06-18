// components/MarkdownRenderer.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

import { useMarkdownRenderer } from "@/hooks/useMarkdownRenderer";

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const { theme } = useTheme();

  const html = useMarkdownRenderer(markdown, theme);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Find all code blocks (Shiki wraps them in <pre class="shiki">)
    const codeBlocks = containerRef.current.querySelectorAll("pre.shiki");

    codeBlocks.forEach((block) => {
      // Skip if already has a copy button
      if (block.querySelector(".copy-code-btn")) return;

      const button = document.createElement("button");
      button.className = "copy-code-btn";
      button.textContent = "Copy";
      button.style.position = "absolute";
      button.style.right = "8px";
      button.style.top = "8px";
      button.style.zIndex = "10";
      button.style.background = "#333";
      button.style.color = "#fff";
      button.style.border = "none";
      button.style.borderRadius = "4px";
      button.style.padding = "4px 8px";
      button.style.cursor = "pointer";
      button.style.fontSize = "12px";

      const codeElement = block.querySelector("code");
      let language = codeElement?.getAttribute("data-language") || "text";

      const fileType = document.createElement("div");
      fileType.className = "filetype-code-btn";
      fileType.textContent = language;
      fileType.style.position = "absolute";
      fileType.style.left = "8px";
      fileType.style.top = "8px";
      fileType.style.zIndex = "10";
      fileType.style.background = "#333";
      fileType.style.color = "#fff";
      fileType.style.border = "none";
      fileType.style.borderRadius = "4px";
      fileType.style.padding = "4px 8px";
      fileType.style.fontSize = "12px";

      button.addEventListener("click", () => {
        const code = block.querySelector("code")?.textContent || "";
        navigator.clipboard.writeText(code).then(() => {
          button.textContent = "Copied!";
          setTimeout(() => {
            button.textContent = "Copy";
          }, 2000);
        });
      });

      // Make the block relative so the absolute button works
      block.style.position = "relative";
      block.appendChild(button);
      block.appendChild(fileType);
    });
  }, [html]);

  return (
    <>
      <div
        ref={containerRef}
        className="markdown"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
};

export default MarkdownRenderer;
