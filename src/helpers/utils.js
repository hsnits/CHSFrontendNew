import markdownit from "markdown-it";
import DOMPurify from "dompurify";

const md = markdownit({
  html: false,
  linkify: true,
  typographer: true,
});

/**
 * Converts Markdown text to safe HTML.
 * @param {string} summary - The Markdown text to convert.
 * @returns {string} - The sanitized HTML string.
 */

const getMdHTMLValue = (summary) => {
  if (!summary) return "";

  const renderedText = md.render(summary);
  const safeHTML = DOMPurify.sanitize(renderedText);

  return safeHTML;
};

export { getMdHTMLValue };
