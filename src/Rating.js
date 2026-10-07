import React, { useState } from "react";

const Rating = ({ totalStars = 5 }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div>
      {[...Array(totalStars)].map((_, index) => {
        const value = index + 1;

        return (
          <span
            key={value}
            style={{
              fontSize: "30px",
              cursor: "pointer",
              color: value <= (hover || rating) ? "gold" : "gray"
            }}
            onClick={() => setRating(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        );
      })}
      <p>Rating: {rating}</p>
    </div>
  );
};

export default Rating;