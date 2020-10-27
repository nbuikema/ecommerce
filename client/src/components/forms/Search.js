import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { SearchOutlined } from '@ant-design/icons';

const Search = () => {
  const [search, setSearch] = useState('');

  const dispatch = useDispatch();

  const history = useHistory();

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: search }
    });

    history.push(`/shop?text=${search}`);
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline my-0">
      <input
        value={search}
        onChange={handleChange}
        type="search"
        className="form-control mr-2"
        placeholder="Search Anything"
      />
      <SearchOutlined onClick={handleSubmit} style={{ cursor: 'pointer' }} />
    </form>
  );
};

export default Search;
