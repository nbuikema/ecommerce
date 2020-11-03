exports.calcCartTotal = (cart) => {
  return parseFloat(
    cart
      .reduce((acc, item) => {
        return acc + item.quantity * item.product.price;
      }, 0)
      .toFixed(2)
  );
};
