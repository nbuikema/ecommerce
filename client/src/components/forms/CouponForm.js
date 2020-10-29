import React from 'react';
import moment from 'moment-timezone';

import { Button, DatePicker } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';

moment.tz.setDefault('America/New_York');

const CouponForm = ({
  name,
  setName,
  discount,
  setDiscount,
  expiration,
  setExpiration,
  handleSubmit,
  method
}) => (
  <form>
    <div className="form-group">
      <label className="text-muted">Coupon Name</label>
      <input
        onChange={(e) => setName(e.target.value)}
        value={name}
        type="text"
        className="form-control"
        required
        autoFocus
      />
    </div>
    <div className="form-group">
      <label className="text-muted">Discount %</label>
      <input
        onChange={(e) => setDiscount(e.target.value)}
        value={discount}
        type="number"
        className="form-control"
        required
      />
    </div>
    <label className="text-muted">Expiration Date and Time</label>
    <br />
    {method && method === 'Update' && expiration && (
      <DatePicker
        onChange={(_, dateString) => setExpiration(dateString)}
        disabledDate={(current) => current && current < moment().startOf('day')}
        showTime={{
          use12Hours: true,
          format: 'hh:mm a z',
          defaultValue: moment('00:00', 'hh:mm')
        }}
        format="MM/DD/YYYY hh:mm a z"
        allowClear={false}
        showNow={false}
        defaultValue={expiration}
      />
    )}
    {method && method === 'Create' && (
      <DatePicker
        onChange={(_, dateString) => setExpiration(dateString)}
        disabledDate={(current) => current && current < moment().startOf('day')}
        showTime={{
          use12Hours: true,
          format: 'hh:mm a z',
          defaultValue: moment('00:00', 'hh:mm')
        }}
        format="MM/DD/YYYY hh:mm a z"
        allowClear={false}
        showNow={false}
      />
    )}
    <Button
      onClick={handleSubmit}
      type="primary"
      block
      shape="round"
      icon={<FileAddOutlined />}
      size="large"
      disabled={!name || !discount || !expiration}
      className="mt-3"
    >
      {method} Coupon
    </Button>
  </form>
);

export default CouponForm;
