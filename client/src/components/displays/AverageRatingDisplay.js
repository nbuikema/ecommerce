import React, { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings/build/star-ratings';

const RatingModal = ({ product }) => {
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (product && product.ratings && product.ratings.length > 0) {
      const length = product.ratings.length;

      let totalRatings = 0;
      product.ratings.forEach((rating) => {
        totalRatings += rating.rating;
      });

      setAverageRating(totalRatings / length);
    }
  }, [product]);

  return (
    <div className="text-center">
      <StarRatings
        numberOfStars={5}
        starRatedColor="red"
        rating={averageRating}
        starDimension="20px"
        starSpacing="2px"
      />
      <span className="pl-2 text-primary">
        {product && product.ratings && product.ratings.length > 0
          ? `(${product.ratings.length})`
          : '(0)'}
      </span>
    </div>
  );
};

export default RatingModal;
