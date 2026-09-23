"use client";
import { useState } from "react";
export function CodeBlock({
  code,
  language = "text",
  label = "Illustrative example",
}: {
  code: string;
  language?: string;
  label?: string;
}) {
  const [message, setMessage] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setMessage("Copied to clipboard.");
    } catch {
      setMessage("Copy unavailable. Select and copy the code below.");
    }
  }
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>
          {label} · {language}
        </span>
        <button onClick={copy} aria-label="Copy code">
          Copy
        </button>
      </div>
      <pre tabIndex={0} aria-label={`${language} code`}>
        <code>{code}</code>
      </pre>
      <span role="status" className="sr-only">
        {message}
      </span>
    </div>
  );
}
