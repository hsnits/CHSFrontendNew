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

const getIdLastDigits = (id, type) => {
  if (!id) {
    return null;
  }
  let word = `#${type || ""}${id.slice(-7)}`;
  return word;
};

function formatDate(dateString) {
  const date = new Date(dateString);

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return date.toLocaleDateString("en-GB", options);
}

export { getMdHTMLValue, getDateFormate, getIdLastDigits, formatDate };
