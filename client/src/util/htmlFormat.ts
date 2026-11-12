import DOMPurify from "dompurify";

export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function purifyHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "ul", "ol", "li", "a"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

const PLAIN_URL_PATTERN = /\b(?:https?:\/\/|www\.)[^\s<>]+/gi;

function linkifyPlainText(html: string): string {
  return html.replace(PLAIN_URL_PATTERN, (match) => {
    const trailing = match.match(/[.,;:!?]+$/)?.[0] ?? "";
    const url = trailing ? match.slice(0, -trailing.length) : match;
    const href = url.startsWith("www.") ? `https://${url}` : url;

    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>${trailing}`;
  });
}

export function renderAnswerHtml(answer: string): string {
  const containsHtml = /<[^>]+>/.test(answer);

  if (containsHtml) {
    return purifyHtml(answer);
  }

  const escapedAnswer = escapeHtml(answer).replaceAll("\n", "<br />");
  return purifyHtml(linkifyPlainText(escapedAnswer));
}
