import React from "react";

interface HighlightTextProps {
  text: string;
  query?: string;
}

export function HighlightText({ text, query }: HighlightTextProps) {
  if (!query || !query.trim()) {
    return <>{text}</>;
  }

  // Regex para buscar o termo (case-insensitive)
  // Utilizamos captura de grupo para preservar a capitalização original na renderização
  const regex = new RegExp(`(${query.trim().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-primary/20 text-foreground px-0.5 rounded-sm font-semibold">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}
