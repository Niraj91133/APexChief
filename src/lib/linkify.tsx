import React from 'react';
import ExternalLink from '@/components/ExternalLink';

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
            <ExternalLink
              key={idx}
              href={href}
              className="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors break-words cursor-pointer"
            >
              {part}
            </ExternalLink>
          );
        }
        return part;
      })}
    </>
  );
}

const ANCHOR_TAG_REGEX = /<a\b[^>]*?href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a\s*>/gi;
const ANY_HTML_TAG_REGEX = /<\/?[a-zA-Z!][^>]*>?/g;

function decodeBasicEntities(str: string): string {
  return str
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;|&#x27;/gi, "'");
}

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function sanitizeHref(raw: string): string {
  const trimmed = decodeBasicEntities(raw).trim();
  if (/^(https?:\/\/|mailto:|\/|#)/i.test(trimmed)) return trimmed;
  if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
  return '#';
}

export function stripHtmlToText(input?: string | null): string {
  if (!input) return '';
  const withBreaks = input.replace(/<(?:br\s*\/?|\/p|\/div|\/li|\/h[1-6])>/gi, ' ');
  const noTags = withBreaks.replace(ANY_HTML_TAG_REGEX, '');
  return decodeBasicEntities(noTags).replace(/\s+/g, ' ').trim();
}

export function buildSafeHtmlExcerpt(htmlOrText?: string | null, maxTextChars = 180): string {
  if (!htmlOrText) return '';
  const normalized = htmlOrText.replace(/<(?:br\s*\/?|\/p|\/div|\/li|\/h[1-6])>/gi, ' ');

  type Token = { kind: 'text'; value: string } | { kind: 'link'; href: string; label: string };
  const tokens: Token[] = [];
  let lastIndex = 0;

  ANCHOR_TAG_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = ANCHOR_TAG_REGEX.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      const rawChunk = normalized.slice(lastIndex, match.index);
      const cleanChunk = decodeBasicEntities(rawChunk.replace(ANY_HTML_TAG_REGEX, '')).replace(/\s+/g, ' ');
      if (cleanChunk) tokens.push({ kind: 'text', value: cleanChunk });
    }
    const href = sanitizeHref(match[1] || match[2] || match[3] || '');
    const label = stripHtmlToText(match[4]);
    if (label) {
      tokens.push({ kind: 'link', href, label });
    }
    lastIndex = ANCHOR_TAG_REGEX.lastIndex;
  }

  if (lastIndex < normalized.length) {
    const tail = normalized.slice(lastIndex);
    const cleanTail = decodeBasicEntities(tail.replace(ANY_HTML_TAG_REGEX, '')).replace(/\s+/g, ' ');
    if (cleanTail) tokens.push({ kind: 'text', value: cleanTail });
  }

  let out = '';
  let visibleLen = 0;
  let truncated = false;

  for (const token of tokens) {
    const remaining = maxTextChars - visibleLen;
    if (remaining <= 0) {
      truncated = true;
      break;
    }

    if (token.kind === 'text') {
      const piece = out.length === 0 ? token.value.trimStart() : token.value;
      if (!piece) continue;
      if (piece.length <= remaining) {
        out += piece;
        visibleLen += piece.length;
      } else {
        const sliced = piece.slice(0, remaining);
        const lastSpace = sliced.lastIndexOf(' ');
        out += (lastSpace > Math.floor(remaining * 0.6) ? sliced.slice(0, lastSpace) : sliced).trimEnd();
        truncated = true;
        break;
      }
    } else {
      // Never cut inside an <a> tag; keep whole anchor if it fits (or allow slight overshoot if it is early)
      if (token.label.length <= remaining || (visibleLen === 0 && token.label.length <= maxTextChars + 40)) {
        out += `<a href="${escapeHtmlAttr(token.href)}" target="_blank" rel="noopener noreferrer">${token.label}</a>`;
        visibleLen += token.label.length;
      } else {
        truncated = true;
        break;
      }
    }
  }

  out = out.trim();
  if (truncated && out) {
    out += '...';
  }
  return out;
}

function hasBrokenHtml(text: string): boolean {
  if (/<\/?[a-zA-Z!][^>]*$/.test(text)) return true;
  const openAnchors = (text.match(/<a\b/gi) || []).length;
  const closeAnchors = (text.match(/<\/a\s*>/gi) || []).length;
  return openAnchors > closeAnchors;
}

export function getCleanPlainExcerpt(
  metaDescription?: string | null,
  excerpt?: string | null,
  fallbackContent?: string | null,
  maxChars = 180
): string {
  const customMeta = stripHtmlToText(metaDescription);
  if (customMeta && !hasBrokenHtml(metaDescription || '')) return customMeta;

  const rawExcerpt = excerpt?.trim() || '';
  if (rawExcerpt && !hasBrokenHtml(rawExcerpt)) {
    const cleaned = stripHtmlToText(rawExcerpt);
    if (cleaned) return cleaned;
  }

  const fromFallback = stripHtmlToText(fallbackContent);
  if (fromFallback) {
    return fromFallback.length > maxChars
      ? `${fromFallback.slice(0, maxChars).trimEnd()}...`
      : fromFallback;
  }

  return stripHtmlToText(rawExcerpt) || customMeta || '';
}

export function renderRichInline(text?: string | null, fallbackSource?: string | null): React.ReactNode {
  const raw = text?.trim() || '';
  if (!raw && !fallbackSource) return '';

  let effectiveSource = raw;
  if (fallbackSource && (!raw || hasBrokenHtml(raw))) {
    effectiveSource = buildSafeHtmlExcerpt(fallbackSource, 200) || raw;
  }
  if (hasBrokenHtml(effectiveSource)) {
    effectiveSource = buildSafeHtmlExcerpt(effectiveSource, 200);
  }

  if (!effectiveSource) return '';

  // Fast path: plain text with no HTML tags at all
  if (!/<[a-zA-Z!/]/.test(effectiveSource)) {
    return linkifyText(decodeBasicEntities(effectiveSource));
  }

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let keyCounter = 0;

  ANCHOR_TAG_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = ANCHOR_TAG_REGEX.exec(effectiveSource)) !== null) {
    if (match.index > lastIndex) {
      const plainBefore = decodeBasicEntities(
        effectiveSource.slice(lastIndex, match.index).replace(ANY_HTML_TAG_REGEX, '')
      );
      if (plainBefore) {
        nodes.push(<React.Fragment key={`t-${keyCounter++}`}>{linkifyText(plainBefore)}</React.Fragment>);
      }
    }

    const href = sanitizeHref(match[1] || match[2] || match[3] || '');
    const label = stripHtmlToText(match[4]);
    if (label) {
      nodes.push(
        <ExternalLink
          key={`a-${keyCounter++}`}
          href={href}
          className="text-[#2271b1] dark:text-blue-400 underline font-medium hover:text-[#135e96] dark:hover:text-blue-300 transition-colors cursor-pointer"
        >
          {label}
        </ExternalLink>
      );
    }
    lastIndex = ANCHOR_TAG_REGEX.lastIndex;
  }

  if (lastIndex < effectiveSource.length) {
    const plainAfter = decodeBasicEntities(
      effectiveSource.slice(lastIndex).replace(ANY_HTML_TAG_REGEX, '')
    );
    if (plainAfter) {
      nodes.push(<React.Fragment key={`t-${keyCounter++}`}>{linkifyText(plainAfter)}</React.Fragment>);
    }
  }

  return nodes.length > 0 ? <>{nodes}</> : stripHtmlToText(effectiveSource);
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
