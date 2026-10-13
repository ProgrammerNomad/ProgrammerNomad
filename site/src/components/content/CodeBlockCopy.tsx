"use client";

import { useState } from "react";

export function CodeBlockCopy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      className="absolute right-2 top-0 min-h-12 min-w-12 font-mono text-[10px] uppercase tracking-widest text-paper/75 hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
      aria-label="Copy code to clipboard"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setFailed(false);
        } catch {
          setFailed(true);
        }
        window.setTimeout(() => {
          setCopied(false);
          setFailed(false);
        }, 3000);
      }}
    >
      <span role="status">
        {copied ? "Copied" : failed ? "Select & copy" : "Copy"}
      </span>
    </button>
  );
}
