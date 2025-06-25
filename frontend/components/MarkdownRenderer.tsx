"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import mermaid from "mermaid";

import { useMarkdownRenderer } from "@/hooks/useMarkdownRenderer";

interface MarkdownRendererProps {
  markdown: string;
}

const setupSvgInteractions = (svgElement: SVGSVGElement) => {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;

  const updateTransform = () => {
    svgElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    svgElement.style.transformOrigin = "0 0";
  };

  // Panning
  svgElement.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    svgElement.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    svgElement.style.cursor = "grab";
  });

  // Zooming
  svgElement.parentElement?.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    scale *= delta;
    updateTransform();
  });

  // Initial setup
  updateTransform();
  svgElement.style.cursor = "grab";
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const { theme } = useTheme();

  const html = useMarkdownRenderer(markdown, theme);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const linkTags = containerRef.current.querySelectorAll("a");
    linkTags.forEach((block) => {
      block.setAttribute("target", "_blank");
      block.setAttribute("rel", "noopener noreferrer");
    });

    // Find all code blocks (Shiki wraps them in <pre class="shiki">)
    const codeBlocks = containerRef.current.querySelectorAll("pre.shiki");

    (codeBlocks as NodeListOf<HTMLPreElement>).forEach((block) => {
      // Skip if already has a copy button
      if (block.querySelector(".copy-code-btn")) return;

      const button = document.createElement("button");
      button.className = "copy-code-btn";
      button.textContent = "Copy";
      Object.assign(button.style, {
        position: "absolute",
        right: "8px",
        top: "8px",
        zIndex: "10",
        background: "#333",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        padding: "4px 8px",
        cursor: "pointer",
        fontSize: "12px",
      });

      const codeElement = block.querySelector("code");
      let language = codeElement?.getAttribute("data-language") || "text";

      if (language == "mermaid" && codeElement) {
        mermaid.initialize({
          startOnLoad: false,
          flowchart: { useMaxWidth: false },
          theme: "forest",
        });

        const mermaidRender = document.createElement("div");
        mermaidRender.className = "mermaid-container";
        Object.assign(mermaidRender.style, {
          overflow: "hidden",
          borderWidth: "1px",
          borderColor: theme === "dark" ? "#fff" : "#000",
          borderRadius: "10px",
        });

        codeElement.parentElement?.insertAdjacentElement(
          "afterend",
          mermaidRender,
        ); // Append the mermaidRender to the block

        const mermaidDiv = document.createElement("div");
        mermaidDiv.className = "mermaid";
        mermaidDiv.textContent = codeElement?.textContent || "";
        mermaidRender.appendChild(mermaidDiv);
      }

      const fileType = document.createElement("div");
      fileType.className = "filetype-code-btn";
      fileType.textContent = language;
      Object.assign(fileType.style, {
        position: "absolute",
        left: "8px",
        top: "8px",
        zIndex: "10",
        background: "#333",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        padding: "4px 8px",
        fontSize: "12px",
      });

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

      // Render the Mermaid diagram
      mermaid.run({
        querySelector: ".mermaid",
        postRenderCallback: (id) => {
          const diagramContainer = document
            .getElementById(id)
            ?.closest(".mermaid-container");
          const svg = diagramContainer?.querySelector("svg");

          if (svg) {
            setupSvgInteractions(svg);
          }
        },
      });
    });
  }, [html, theme]);

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
