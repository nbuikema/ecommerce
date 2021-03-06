import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { SearchOutlined } from '@ant-design/icons';
import './NavSearch.css';

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

    history.push('/shop');
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <input
        value={search}
        onChange={handleChange}
        type="search"
        className="form-control"
        placeholder="Search Anything"
      />
      <SearchOutlined
        className="search-icon"
        onClick={handleSubmit}
        style={{ cursor: 'pointer' }}
      />
    </form>
  );
};

export default Search;
