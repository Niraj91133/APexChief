import React from 'react';

/**
 * URL matching regular expression supporting http://, https://, and www.
 */
const URL_REGEX = /(https?:\/\/[^\s<>"]+|www\.[^\s<>"]+)/gi;

/**
 * Converts plain text containing URLs into React elements with clickable links.
 * Works seamlessly in headlines, paragraphs, excerpts, and sections.
 */
export function linkifyText(text?: string | null): React.ReactNode {
  if (!text) return text ?? '';

  const parts = text.split(URL_REGEX);
  if (parts.length === 1) {
    return text;
  }

  return (
    <>
      {parts.map((part, idx) => {
        if (part.match(URL_REGEX)) {
          const href = part.startsWith('http://') || part.startsWith('https://') 
            ? part 
            : `https://${part}`;

          return (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors break-words cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </>
  );
}

/**
 * Converts raw URLs inside HTML strings into clickable <a> tags
 * while preserving existing <a> links and HTML tags intact.
 */
export function linkifyHtml(html?: string | null): string {
  if (!html) return '';

  return html.replace(
    /(<a\b[^>]*>[\s\S]*?<\/a>|<[^>]+>)|((https?:\/\/[^\s<>"'`]+|www\.[^\s<>"'`]+))/gi,
    (match, isTagOrLink, isUrl) => {
      if (isTagOrLink) return match;
      if (isUrl) {
        // Clean trailing punctuation if any (like dot or comma at end of sentence)
        let cleanUrl = isUrl;
        let trailingPunct = '';
        if (/[.,;:!?)]$/.test(cleanUrl)) {
          trailingPunct = cleanUrl.slice(-1);
          cleanUrl = cleanUrl.slice(0, -1);
        }

        const href = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')
          ? cleanUrl
          : `https://${cleanUrl}`;

        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer">${cleanUrl}</a>${trailingPunct}`;
      }
      return match;
    }
  );
}
