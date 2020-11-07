import {
  addItemToCart,
  changeQuantity,
  removeItemFromCart
} from '../helpers/cart';

const INITIAL_STATE = {
  cart: [],
  showDrawer: false
};

export const cartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SHOW_CART':
      return { ...state, showDrawer: action.payload };
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: addItemToCart(state.cart, action.payload)
      };
    case 'CHANGE_QUANTITY':
      return {
        ...state,
        cart: changeQuantity(state.cart, action.payload)
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: removeItemFromCart(state.cart, action.payload)
      };
    case 'GET_CART_FROM_DB':
      return { ...state, cart: action.payload };
    case 'EMPTY_CART':
      return { ...state, cart: [] };
    default:
      return state;
  }
};
