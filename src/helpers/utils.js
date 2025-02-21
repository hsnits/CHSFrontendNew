import markdownit from "markdown-it";
import DOMPurify from "dompurify";
import moment from "moment/moment";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

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

const TruncatedText = (text) => {
  if (!text) return "";
  const words = text?.split(" ");
  const truncatedText =
    words?.length > 6 ? words?.slice(0, 6).join(" ") + "..." : text;

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id="tooltip">{text}</Tooltip>}
    >
      <span>{truncatedText}</span>
    </OverlayTrigger>
  );
};

export {
  getMdHTMLValue,
  getDateFormate,
  getIdLastDigits,
  formatDate,
  TruncatedText,
};
