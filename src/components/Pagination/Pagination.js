import React from "react";
import "./Pagination.css";

const Pagination = ({ currentCount, totalCount, onViewMore }) => {
  if (currentCount >= totalCount) return null;

  return (
    <div className="pagination">
      <button onClick={onViewMore}>View More</button>
    </div>
  );
};

export default Pagination;
