export const navReducer = (state = false, action) => {
  switch (action.type) {
    case 'SHOW_NAV_OPTIONS':
      return action.payload;
    default:
      return state;
  }
};
