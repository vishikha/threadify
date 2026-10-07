// src/components/Rating.jsx
import React from "react";
import "./Rating.css";

const Rating = ({ value = 0, onChange, edit = false }) => {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (star) => {
    if (!edit) return;
    onChange && onChange(star);
  };

  return (
    <div className="rating">
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= value ? "filled" : ""} ${edit ? "editable" : ""}`}
          onClick={() => handleClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default Rating;