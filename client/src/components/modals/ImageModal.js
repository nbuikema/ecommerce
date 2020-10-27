import React, { useState } from 'react';

import { Modal } from 'antd';

const RatingModal = ({ title, images }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const showImages = () => (
    <div
      id="carouselExampleIndicators"
      className="carousel slide"
      data-ride="carousel"
    >
      <div className="carousel-inner">
        {images &&
          images.length > 0 &&
          images.map((image, i) => (
            <div
              key={i}
              className={`carousel-item h-100 ${i === 0 ? 'active' : ''}`}
            >
              <img
                src={image.url}
                className="d-block w-100 h-100"
                alt={image.url}
              />
            </div>
          ))}
        <a
          className="carousel-control-prev"
          href="#carouselExampleIndicators"
          role="button"
          data-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Previous</span>
        </a>
        <a
          className="carousel-control-next"
          href="#carouselExampleIndicators"
          role="button"
          data-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
      <ol className="carousel-indicators row mt-4">
        {images &&
          images.length > 0 &&
          images.map((image, i) => (
            <li
              className={`col px-0 mb-0 ${i === 0 ? 'active' : ''}`}
              key={i}
              data-target="#carouselExampleIndicators"
              data-slide-to={i}
            >
              <img src={image.url} className="d-block h-100" alt={image.url} />
            </li>
          ))}
      </ol>
    </div>
  );

  return (
    <>
      <div onClick={() => setModalVisible(!modalVisible)}>
        <img
          src={images[0].url}
          alt={title}
          style={{ width: '100px', height: 'auto', cursor: 'pointer' }}
        />
      </div>
      <Modal
        title={title}
        centered
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        maskTransitionName=""
      >
        {showImages()}
      </Modal>
    </>
  );
};

export default RatingModal;
