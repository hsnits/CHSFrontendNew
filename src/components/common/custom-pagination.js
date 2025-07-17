import React from "react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxDisplayedPages = 5;

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxDisplayedPages / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);

    if (endPage - startPage < maxDisplayedPages - 1) {
      startPage = Math.max(1, endPage - (maxDisplayedPages - 1));
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return (
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => page !== "..." && handlePageChange(page)}
            disabled={page === "..." || page === currentPage}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: page === currentPage ? "#002f6c" : "#fff",
              color: page === currentPage ? "#fff" : "#002f6c",
              fontWeight: page === currentPage ? "bold" : "normal",
              cursor: page === "..." ? "default" : "pointer",
              opacity: page === currentPage || page === "..." ? 0.6 : 1,
            }}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        gap: "8px",
      }}
    >
      {" "}
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`pagination-btn`}
      >
        <MdKeyboardDoubleArrowLeft />
      </button>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`pagination-btn `}
      >
        <MdKeyboardArrowLeft />
      </button>
      <span className="pagination-menu">{renderPageNumbers()}</span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`pagination-btn`}
      >
        <MdKeyboardArrowRight />
      </button>
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`pagination-btn`}
      >
        <MdKeyboardDoubleArrowRight />
      </button>
    </div>
  );
};

export default CustomPagination;
