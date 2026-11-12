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

export function renderAnswerHtml(answer: string): string {
  const containsHtml = /<[^>]+>/.test(answer);

  const escapedAnswer = escapeHtml(answer).replaceAll("\n", "<br />");

  if (containsHtml) {
    return purifyHtml(answer);
  } else {
    return escapedAnswer;
  }
}
