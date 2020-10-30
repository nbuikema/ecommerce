import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { Modal } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';

const RatingModal = ({ children, handleSubmitRating, product, rating }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  const history = useHistory();

  const { slug } = useParams();

  const handleModal = () => {
    if (user && user.token) {
      setModalVisible(true);
    } else {
      history.push({
        pathname: '/login',
        state: { from: `/product/${slug}` }
      });
    }
  };

  return (
    <>
      <div onClick={handleModal}>
        {user && user.token && rating === 0 ? (
          <StarOutlined className="text-danger" />
        ) : (
          <StarFilled className="text-danger" />
        )}
        <br />
        {user && user.token
          ? rating === 0
            ? 'Leave Rating'
            : 'Update Rating'
          : 'Login to Leave Rating'}
      </div>
      <Modal
        title="Leave Your Rating"
        centered
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
          handleSubmitRating(product);
        }}
        onCancel={() => setModalVisible(false)}
        maskTransitionName=""
      >
        {children}
      </Modal>
    </>
  );
};

export default RatingModal;
