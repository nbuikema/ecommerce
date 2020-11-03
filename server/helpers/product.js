exports.setQuery = (date) => {
  let query;

  switch (date) {
    case 'Overall':
      query = { orderedYear: { $gte: 0 } };
      break;
    case 'This Year':
      query = { orderedYear: { $eq: new Date().getFullYear() } };
      break;
    case 'This Month':
      query = {
        orderedMonth: { $eq: new Date().getMonth() + 1 },
        orderedYear: { $eq: new Date().getFullYear() }
      };
      break;
    case 'This Week':
      query = {
        orderedWeek: { $eq: moment(new Date()).week() - 1 },
        orderedYear: { $eq: new Date().getFullYear() }
      };
      break;
    case 'Today':
      query = {
        orderedYear: { $eq: new Date().getFullYear() },
        orderedMonth: { $eq: new Date().getMonth() + 1 },
        orderedDayOfMonth: { $eq: new Date().getDate() }
      };
      break;
  }

  return query;
};

exports.setProductsByDate = (sort, orders) => {
  let productsByDate = [];

  orders.forEach((order) => {
    let title = '';
    let sales = 0;
    let sold = 0;

    order.productsList.forEach((product, index) => {
      const existsIndex = productsByDate.findIndex(
        (x) => x.title === product.title
      );

      if (existsIndex > -1) {
        productsByDate[existsIndex].sold += order.products[index].quantity;
        productsByDate[existsIndex].sales = parseFloat(
          (
            product.price * order.products[index].quantity +
            productsByDate[existsIndex].sales
          ).toFixed(2)
        );
      } else {
        title = product.title;
        sales = parseFloat(
          (product.price * order.products[index].quantity).toFixed(2)
        );
        sold = order.products[index].quantity;

        productsByDate.push({ title, sales, sold });
      }
    });
  });

  switch (sort) {
    case 'Gross Sales - High to Low':
      productsByDate.sort((a, b) => b.sales - a.sales);
      break;
    case 'Gross Sales - Low to High':
      productsByDate.sort((a, b) => a.sales - b.sales);
      break;
    case 'Quantity Sold - High to Low':
      productsByDate.sort((a, b) => b.sold - a.sold);
      break;
    case 'Quantity Sold - Low to High':
      productsByDate.sort((a, b) => a.sold - b.sold);
      break;
  }

  return productsByDate;
};
