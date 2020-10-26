import React from 'react';
import StarRating from 'react-star-ratings';

const RatingsForm = ({ starClick, numberOfStars, rating }) => (
  <StarRating
    changeRating={() => starClick(numberOfStars)}
    numberOfStars={numberOfStars}
    starDimension="20px"
    starSpacing="2px"
    starHoverColor="red"
    starEmptyColor={rating === numberOfStars ? 'red' : 'gray'}
  />
);

export default RatingsForm;
