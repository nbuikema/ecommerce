import React from 'react';

const SearchForm = ({ searchQuery, setSearchQuery }) => {
  const handleSearchChange = (e) => {
    e.preventDefault();

    setSearchQuery(e.target.value.toLowerCase());
  };

  return (
    <input
      type="search"
      placeholder="Find Categories"
      value={searchQuery}
      onChange={handleSearchChange}
      className="form-control mb-4"
    />
  );
};

export default SearchForm;
