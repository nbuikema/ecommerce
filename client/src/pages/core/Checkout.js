import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateAddress } from '../../api/user';
import { currentUser } from '../../api/auth';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import StripeCheckoutForm from '../../components/forms/StripeCheckoutForm/StripeCheckoutForm';
import OrderSummaryDisplay from '../../components/displays/OrderSummaryDisplay';
import DeliveryAddressForm from '../../components/forms/DeliveryAddressForm';

import { Form, Select, Tabs } from 'antd';
const { Option } = Select;
const { Item } = Form;
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
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState('');

  const { user } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

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

            if (!unmounted.current) {
              setNewAddress(false);

              setActiveTab('2');
            }
          }
        );
      })
      .catch((error) => {
        toast.error(error.message);
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

  return (
    <div className="container">
      <div className="row pt-4">
        <div className="col-lg-8">
          <h3 className="text-primary">Checkout</h3>
          <hr />
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
              <h4 className="text-primary">Delivery Address</h4>
              <hr />
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
                <DeliveryAddressForm onFinish={onFinish} address={address} />
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
                  succeeded={succeeded}
                  setSucceeded={setSucceeded}
                  processing={processing}
                  setProcessing={setProcessing}
                />
              </Elements>
            </TabPane>
          </Tabs>
        </div>
        <div className="col-lg-4 ">
          <OrderSummaryDisplay />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
