import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateAddress } from '../../api/user';
import { currentUser } from '../../api/auth';
import { getCoupon } from '../../api/coupon';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import StripeCheckoutForm from '../../components/forms/StripeCheckoutForm';

import { Form, Input, Button, Select, Tabs } from 'antd';
const { Option } = Select;
const { Item } = Form;
const { Group, TextArea } = Input;
const { TabPane } = Tabs;

const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Checkout = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [newAddress, setNewAddress] = useState(false);
  const [address, setAddress] = useState({
    address: '',
    secondaryType: 'None',
    secondaryAddress: '',
    city: '',
    state: '',
    zip: '',
    additionalInfo: ''
  });
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState('');

  const { cart, user } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const getTotal = () => {
    return parseFloat(
      cart
        .reduce((acc, item) => {
          return acc + item.quantity * item.product.price;
        }, 0)
        .toFixed(2)
    );
  };

  const onFinish = (values) => {
    setAddress(values);

    updateAddress(values, user.token)
      .then(() => {
        currentUser(user.token).then(
          ({ data: { _id, email, name, role, address } }) => {
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                _id,
                email,
                name,
                role,
                address,
                token: user.token
              }
            });

            setNewAddress(false);

            setActiveTab('2');
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (value) => {
    if (value > -1) {
      setAddress(user.address[value]);
      setNewAddress(false);
      setActiveTab('2');
    } else {
      setAddress({
        address: '',
        secondaryType: 'None',
        secondaryAddress: '',
        city: '',
        state: '',
        zip: '',
        additionalInfo: ''
      });
      setNewAddress(true);
    }
  };

  const handleChangeTab = (activeKey) => {
    setActiveTab(activeKey);
  };

  const handleCoupon = () => {
    getCoupon(coupon)
      .then((coupon) => {
        if (coupon.data) {
          setDiscount(coupon.data.discount);

          toast.success('Coupon Added!');
        } else {
          toast.error('Invalid Coupon.');
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="container">
      <h4>Checkout</h4>
      <hr />
      <div className="row">
        <div className="col-md-8">
          <Tabs
            activeKey={activeTab}
            type="card"
            size="large"
            onChange={handleChangeTab}
          >
            <TabPane
              tab="Delivery Info"
              key="1"
              onClick={() => handleChangeTab('1')}
            >
              <h4>Delivery Address</h4>
              {user && (
                <Form layout="vertical">
                  <Item label="Select Address" className="mb-0">
                    <Item>
                      <Select
                        onChange={handleChange}
                        placeholder="Select Address"
                        className="w-100"
                      >
                        <Option value={-1}>Add New Address</Option>
                        {user.address &&
                          user.address.map((address, index) => (
                            <Option key={index} value={index}>
                              {address.address},{' '}
                              {address.secondaryType !== 'None' &&
                                address.secondaryType +
                                  ' ' +
                                  address.secondaryAddress +
                                  ', '}
                              {address.city}, {address.state}, {address.zip}
                            </Option>
                          ))}
                      </Select>
                    </Item>
                  </Item>
                </Form>
              )}
              {newAddress && (
                <Form
                  layout="vertical"
                  initialValues={address}
                  requiredMark="optional"
                  onFinish={onFinish}
                >
                  <Item label="Street Address" required className="mb-0">
                    <Item
                      name="address"
                      rules={[
                        { required: true, message: 'Address is required.' }
                      ]}
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
                      rules={[
                        { required: true, message: 'State is required.' }
                      ]}
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
                      rules={[
                        { required: true, message: 'Zip Code is required.' }
                      ]}
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
              )}
            </TabPane>
            <TabPane
              tab="Payment Info"
              key="2"
              onClick={() => handleChangeTab('2')}
              disabled={!address.address}
            >
              <h4>Payment Info</h4>
              <Elements stripe={promise}>
                <StripeCheckoutForm
                  address={address}
                  coupon={coupon}
                  discount={discount}
                  succeeded={succeeded}
                  setSucceeded={setSucceeded}
                  processing={processing}
                  setProcessing={setProcessing}
                />
              </Elements>
            </TabPane>
          </Tabs>
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <h6>Products</h6>
          {cart.map((item, index) => (
            <div key={index}>
              <p>
                {item.product.title} x {item.quantity} = $
                {parseFloat(item.quantity * item.product.price).toFixed(2)}
              </p>
            </div>
          ))}
          <hr />
          <h6>Enter Coupon</h6>
          <div className="row">
            <div className="col-8">
              <input
                type="text"
                className="form-control"
                onChange={(e) => setCoupon(e.target.value)}
                disabled={succeeded || processing}
              />
            </div>
            <div className="col-4">
              <button
                onClick={handleCoupon}
                className="btn btn-primary"
                disabled={succeeded || processing}
              >
                Apply Coupon
              </button>
            </div>
          </div>
          {discount ? <h6 className="mt-2">Discount: {discount}%</h6> : null}
          <hr />
          {discount ? (
            <>
              <h6>
                <s>Total: ${getTotal()}</s>
              </h6>
              <h6>
                New Total: $
                {parseFloat((getTotal() * (discount / 100)).toFixed(2))}
              </h6>
            </>
          ) : (
            <h6>Total: ${getTotal()}</h6>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
