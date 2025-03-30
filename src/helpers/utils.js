import markdownit from "markdown-it";
import DOMPurify from "dompurify";
import moment from "moment/moment";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toastMessage } from "../config/toast";
import { callPostApi } from "../_service";

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

const formatName = (data, profile = "Dr") => {
  if (!data?.firstName && !data?.lastName) return `${profile}.`;
  if (!data?.firstName) return `${profile}. ${data.lastName}`;
  if (!data?.lastName) return `${profile}. ${data.firstName}`;

  return `${profile}. ${data.firstName} ${data.lastName}`;
};

const cpFirstName = (name) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const uploadFile = async (file, message) => {
  const formData = new FormData();
  formData.append("file", file);

  toastMessage("success", message || "file is uploading...");

  // ✅ Upload File
  const res = await callPostApi("user/upload-file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!res?.data?.location) {
    throw new Error("File Uploading Error.");
  }

  return res?.data;
};

export {
  getMdHTMLValue,
  getDateFormate,
  getIdLastDigits,
  formatDate,
  formatName,
  TruncatedText,
  cpFirstName,
  uploadFile,
};
