const INITIAL_STATE = {
  text: '',
  sort: ['Best Sellers', 'sold', 'desc'],
  price: [null, null],
  categories: [],
  subcategories: [],
  rating: null,
  shipping: null
};

export const searchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SEARCH_QUERY':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
