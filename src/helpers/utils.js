import markdownit from "markdown-it";
import DOMPurify from "dompurify";
import moment from "moment/moment";

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

const getDateFormate = (date) => {
  if (!date) {
    return null;
  }
  return moment(date).format("DD MMM YYYY");
};

const getIdLastDigit = (date) => {
  if (!date) {
    return null;
  }
  return moment(date).format("DD MMM YYYY");
};

const getIdLastDigits = (id) => {
  if (!id) {
    return null;
  }
  return id.slice(-5);
};

export { getMdHTMLValue, getDateFormate, getIdLastDigits };
