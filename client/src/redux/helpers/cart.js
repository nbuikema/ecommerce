export const addItemToCart = (cart, cartItemToAdd) => {
  const existingCartItem = cart.find(
    (cartItem) => cartItem.product._id === cartItemToAdd.product._id
  );

  if (!existingCartItem) {
    return [...cart, { ...cartItemToAdd, quantity: 1 }];
  } else {
    return [...cart];
  }
};

export const changeQuantity = (cart, cartItemToAdd) => {
  const existingCartItem = cart.find(
    (cartItem) => cartItem.product._id === cartItemToAdd.product._id
  );

  if (existingCartItem) {
    return cart.map((cartItem) =>
      cartItem.product._id === cartItemToAdd.product._id
        ? { ...cartItem, quantity: cartItemToAdd.quantity }
        : cartItem
    );
  } else {
    return [...cart];
  }
};

export const removeItemFromCart = (cart, cartItemToRemove) => {
  const existingCartItem = cart.find(
    (cartItem) => cartItem.product._id === cartItemToRemove._id
  );

  if (existingCartItem) {
    return cart.filter(
      (cartItem) => cartItem.product._id !== cartItemToRemove._id
    );
  } else {
    return [...cart];
  }
};
