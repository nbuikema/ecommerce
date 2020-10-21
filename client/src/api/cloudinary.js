import axios from 'axios';

export const upload = async (uri, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/cloudinary/upload`,
    { image: uri },
    {
      headers: {
        authtoken
      }
    }
  );
};

export const remove = async (public_id, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/cloudinary/remove`,
    { public_id },
    {
      headers: {
        authtoken
      }
    }
  );
};
