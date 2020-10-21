import React from 'react';

import { Button, Select } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
const { Option } = Select;

const ProductForm = ({
  product,
  setProduct,
  categories,
  subcats,
  handleChange,
  handleSubmit
}) => {
  const {
    title,
    description,
    price,
    category,
    subcategories,
    quantity,
    shipping
  } = product;

  return (
    <form>
      <div className="form-group">
        <label>Title</label>
        <input
          value={title}
          onChange={handleChange}
          type="text"
          name="title"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={handleChange}
          name="description"
          className="form-control"
          rows="6"
        />
      </div>
      <div className="form-group">
        <label>Price</label>
        <input
          value={price}
          onChange={handleChange}
          type="number"
          name="price"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Quantity</label>
        <input
          value={quantity}
          onChange={handleChange}
          type="number"
          name="quantity"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Shipping</label>
        <select
          value={shipping}
          onChange={handleChange}
          name="shipping"
          className="form-control"
        >
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>
      </div>
      <div className="form-group">
        <label>Category</label>
        <select
          onChange={handleChange}
          value={category}
          name="category"
          className="form-control"
        >
          <option value="-1">Select Category</option>
          {categories &&
            categories.length > 0 &&
            categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
      </div>

      {category && category.length > 0 && (
        <div className="form-group">
          <label>Subcategories</label>
          <Select
            value={subcategories}
            onChange={(value) =>
              setProduct({ ...product, subcategories: value })
            }
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Subcategories"
            className="form-control"
          >
            {subcats &&
              subcats.length > 0 &&
              subcats.map((subcategory) => (
                <Option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </Option>
              ))}
          </Select>
        </div>
      )}
      <Button
        onClick={handleSubmit}
        type="primary"
        block
        shape="round"
        icon={<FileAddOutlined />}
        size="large"
      >
        Create Product
      </Button>
    </form>
  );
};

export default ProductForm;
