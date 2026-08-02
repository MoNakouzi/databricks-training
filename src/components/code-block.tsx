"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return <div className="code-shell"><div className="code-bar"><span><i /><i /><i /></span><button onClick={copy} aria-label="Copy code">{copied ? <CheckIcon /> : <CopyIcon />}{copied ? "Copied" : "Copy"}</button></div><pre><code>{code}</code></pre></div>;
}
