'use client';

import { memo, type ReactNode } from 'react';

/**
 * Renders teaching text with engaging effects:
 * - Lightweight markdown: **bold**, *italic*, newlines
 * - Word-by-word fade-in animation (mascot "speaking" feel)
 * - Numbers/measurements highlighted in accent color + bold
 * - First sentence rendered slightly bolder as a hook
 */

interface InlineToken {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

/** Parse **bold** and *italic* markdown into tokens */
function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let match;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      tokens.push({ text: text.slice(last, match.index) });
    }
    if (match[1]) tokens.push({ text: match[1], bold: true });
    else if (match[2]) tokens.push({ text: match[2], italic: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    tokens.push({ text: text.slice(last) });
  }
  return tokens;
}

function EngagingText({ text, accentColor }: { text: string; accentColor: string }) {
  if (!text) return null;

  // Strip markdown for sentence boundary detection
  const plain = text.replace(/\*\*(.+?)\*\*|\*(.+?)\*/g, '$1$2');
  const sentenceMatch = plain.match(/[.!?](\s|$)/);
  const firstEnd = sentenceMatch ? sentenceMatch.index! + 1 : plain.length;

  // Split by newlines into paragraphs
  const paragraphs = text.split(/\n\n+/);

  let plainCharCount = 0;
  let wordIdx = 0;

  function renderWord(
    word: string,
    key: string,
    opts: { bold?: boolean; italic?: boolean; isFirst: boolean },
  ): ReactNode {
    const hasNumber = /\d/.test(word);
    const i = wordIdx++;

    const style: React.CSSProperties = {
      display: 'inline',
      opacity: 0,
      animation: 'lb-word-in 0.3s ease forwards',
      animationDelay: `${0.15 + i * 0.025}s`,
    };

    if (hasNumber) {
      style.color = accentColor;
      style.fontWeight = 700;
    } else if (opts.bold) {
      style.fontWeight = 700;
    } else if (opts.isFirst) {
      style.fontWeight = 600;
    }

    if (opts.italic) {
      style.fontStyle = 'italic';
    }

    return <span key={key} style={style}>{word}</span>;
  }

  function renderParagraph(para: string, pi: number): ReactNode {
    // Handle single newlines as line breaks
    const lines = para.split(/\n/);

    return lines.map((line, li) => {
      const inlineTokens = parseInline(line);
      const nodes: ReactNode[] = [];

      for (let ti = 0; ti < inlineTokens.length; ti++) {
        const token = inlineTokens[ti];
        // Split token text into words preserving whitespace
        const parts = token.text.split(/(\s+)/);

        for (let wi = 0; wi < parts.length; wi++) {
          const part = parts[wi];
          if (/^\s+$/.test(part)) {
            nodes.push(part);
            plainCharCount += part.length;
            continue;
          }
          // Track position in plain text for first-sentence detection
          const isFirst = plainCharCount < firstEnd;
          nodes.push(
            renderWord(part, `${pi}-${li}-${ti}-${wi}`, {
              bold: token.bold,
              italic: token.italic,
              isFirst,
            }),
          );
          plainCharCount += part.length;
        }
      }

      // Add <br> between lines within the same paragraph
      if (li < lines.length - 1) {
        nodes.push(<br key={`br-${pi}-${li}`} />);
      }

      return nodes;
    });
  }

  return (
    <>
      <style>{`@keyframes lb-word-in{from{opacity:0;filter:blur(2px);transform:translateY(3px)}to{opacity:1;filter:blur(0);transform:translateY(0)}}`}</style>
      {paragraphs.map((para, pi) => (
        <span key={pi} style={pi > 0 ? { display: 'block', marginTop: 10 } : undefined}>
          {renderParagraph(para, pi)}
        </span>
      ))}
    </>
  );
}

export default memo(EngagingText);
