export const cartReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      let existsIndex = state
        .map((cartItem) => cartItem.product._id)
        .indexOf(action.payload.product._id);

      if (existsIndex > -1) {
        let newState = state.map((cartItem) => cartItem);

        newState[existsIndex].quantity++;

        return newState;
      } else {
        return [...state, action.payload];
      }
    case 'CHANGE_QUANTITY':
      let existsIndexC = state
        .map((cartItem) => cartItem.product._id)
        .indexOf(action.payload.product._id);

      if (existsIndexC > -1) {
        let newState = state.map((cartItem) => cartItem);

        newState[existsIndexC].quantity = action.payload.quantity;

        return newState;
      } else {
        return state;
      }
    case 'REMOVE_FROM_CART':
      let existsIndexR = state
        .map((cartItem) => cartItem.product._id)
        .indexOf(action.payload._id);

      if (existsIndexR > -1) {
        let newState = state.map((cartItem) => cartItem);

        newState.splice(existsIndexR, 1);

        return newState;
      } else {
        return state;
      }
    default:
      return state;
  }
};
