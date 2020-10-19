import React from 'react';

import { Button } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';

const CategoryForm = ({ name, setName, handleSubmit, method }) => (
  <form>
    <div className="form-group">
      <input
        onChange={(e) => setName(e.target.value)}
        value={name}
        type="text"
        className="form-control"
        placeholder="Category Name"
        required
        autoFocus
      />
    </div>
    <Button
      onClick={handleSubmit}
      type="primary"
      block
      shape="round"
      icon={<FileAddOutlined />}
      size="large"
      disabled={!name}
    >
      {method} Category
    </Button>
  </form>
);

export default CategoryForm;
