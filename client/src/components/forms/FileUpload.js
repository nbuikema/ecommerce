import React from 'react';
import Resizer from 'react-image-file-resizer';
import { useSelector } from 'react-redux';
import { upload, remove } from '../../api/cloudinary';
import { toast } from 'react-toastify';

import { Avatar, Badge } from 'antd';

const FileUpload = ({ product, setProduct }) => {
  const {
    user: { token }
  } = useSelector((state) => ({ ...state }));

  const handleResizeAndUpload = (e) => {
    let files = e.target.files;
    let uploadedFiles = product.images;

    if (files) {
      [...files].forEach((file) => {
        Resizer.imageFileResizer(
          file,
          720,
          720,
          'JPEG',
          100,
          0,
          (uri) => {
            upload(uri, token)
              .then((res) => {
                uploadedFiles.push(res.data);

                setProduct({ ...product, images: uploadedFiles });

                toast.success('Image uploaded.');
              })
              .catch((error) => {
                toast.error(error);
              });
          },
          'base64'
        );
      });
    }
  };

  const handleRemove = (public_id) => {
    remove(public_id, token)
      .then(() => {
        const { images } = product;

        let filteredImages = images.filter((image) => {
          return image.public_id !== public_id;
        });

        setProduct({ ...product, images: filteredImages });

        toast.success('Image removed.');
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="container">
      <div className="row">
        <label className="btn btn-primary">
          Select Files
          <input
            onChange={handleResizeAndUpload}
            type="file"
            hidden
            multiple
            accept="images/*"
          />
        </label>
      </div>
      <div className="row">
        {product.images &&
          product.images.map((image) => (
            <Badge
              onClick={() => handleRemove(image.public_id)}
              key={image.public_id}
              count="X"
              className="m-3"
              style={{ cursor: 'pointer' }}
            >
              <Avatar src={image.url} size={100} shape="square" />
            </Badge>
          ))}
      </div>
    </div>
  );
};

export default FileUpload;
