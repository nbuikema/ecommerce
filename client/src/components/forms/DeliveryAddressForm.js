import React from 'react';

import { Form, Input, Button, Select } from 'antd';
const { Option } = Select;
const { Item } = Form;
const { Group, TextArea } = Input;

const DeliveryAddressForm = ({ onFinish, address }) => {
  return (
    <Form
      layout="vertical"
      initialValues={address}
      requiredMark="optional"
      onFinish={onFinish}
    >
      <Item label="Street Address" required className="mb-0">
        <Item
          name="address"
          rules={[{ required: true, message: 'Address is required.' }]}
        >
          <Input placeholder="Address" />
        </Item>
      </Item>
      <Item label="Apt / Ste / Floor" className="mb-0">
        <Group compact className="d-flex">
          <Item
            name="secondaryType"
            rules={[
              {
                required: true,
                message: 'Secondary Address is required.'
              }
            ]}
            style={{ width: '120px' }}
          >
            <Select className="w-100">
              <Option value="None">None</Option>
              <Option value="Apt">Apt</Option>
              <Option value="Ste">Ste</Option>
              <Option value="Floor">Floor</Option>
            </Select>
          </Item>
          <Item
            name="secondaryAddress"
            className="ml-2"
            style={{ flexGrow: '1' }}
          >
            <Input />
          </Item>
        </Group>
      </Item>
      <Item label="City" required className="mb-0">
        <Item
          name="city"
          rules={[{ required: true, message: 'City is required.' }]}
        >
          <Input placeholder="City" />
        </Item>
      </Item>
      <Item label="State" required className="mb-0">
        <Item
          name="state"
          rules={[{ required: true, message: 'State is required.' }]}
        >
          <Select showSearch>
            <Option value="">Select</Option>
            <Option value="AL">AL</Option>
            <Option value="AK">AK</Option>
            <Option value="AR">AR</Option>
            <Option value="AZ">AZ</Option>
            <Option value="CA">CA</Option>
            <Option value="CO">CO</Option>
            <Option value="CT">CT</Option>
            <Option value="DC">DC</Option>
            <Option value="DE">DE</Option>
            <Option value="FL">FL</Option>
            <Option value="GA">GA</Option>
            <Option value="HI">HI</Option>
            <Option value="IA">IA</Option>
            <Option value="ID">ID</Option>
            <Option value="IL">IL</Option>
            <Option value="IN">IN</Option>
            <Option value="KS">KS</Option>
            <Option value="KY">KY</Option>
            <Option value="LA">LA</Option>
            <Option value="MA">MA</Option>
            <Option value="MD">MD</Option>
            <Option value="ME">ME</Option>
            <Option value="MI">MI</Option>
            <Option value="MN">MN</Option>
            <Option value="MO">MO</Option>
            <Option value="MS">MS</Option>
            <Option value="MT">MT</Option>
            <Option value="NC">NC</Option>
            <Option value="NE">NE</Option>
            <Option value="NH">NH</Option>
            <Option value="NJ">NJ</Option>
            <Option value="NM">NM</Option>
            <Option value="NV">NV</Option>
            <Option value="NY">NY</Option>
            <Option value="ND">ND</Option>
            <Option value="OH">OH</Option>
            <Option value="OK">OK</Option>
            <Option value="OR">OR</Option>
            <Option value="PA">PA</Option>
            <Option value="RI">RI</Option>
            <Option value="SC">SC</Option>
            <Option value="SD">SD</Option>
            <Option value="TN">TN</Option>
            <Option value="TX">TX</Option>
            <Option value="UT">UT</Option>
            <Option value="VT">VT</Option>
            <Option value="VA">VA</Option>
            <Option value="WA">WA</Option>
            <Option value="WI">WI</Option>
            <Option value="WV">WV</Option>
            <Option value="WY">WY</Option>
          </Select>
        </Item>
      </Item>
      <Item label="Zip Code" required className="mb-0">
        <Item
          name="zip"
          rules={[{ required: true, message: 'Zip Code is required.' }]}
        >
          <Input placeholder="Zip Code" />
        </Item>
      </Item>
      <Item label="Additional Info" className="mb-0">
        <Item name="additionalInfo">
          <TextArea rows={4} />
        </Item>
      </Item>
      <Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Item>
    </Form>
  );
};

export default DeliveryAddressForm;
