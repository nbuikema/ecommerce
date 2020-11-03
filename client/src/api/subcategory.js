import axios from 'axios';

// create subcategory
export const createSubcategory = async (subcategory, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/subcategory`,
    subcategory,
    {
      headers: {
        authtoken
      }
    }
  );
};

// read subcategories
export const getAllSubcategories = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/subcategories`);
};

export const getSubcategory = async (slug) => {
  return await axios.get(`${process.env.REACT_APP_API}/subcategory/${slug}`);
};

// update subcategory
export const updateSubcategory = async (slug, subcategory, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/subcategory/${slug}`,
    subcategory,
    {
      headers: {
        authtoken
      }
    }
  );
};

// delete subcategory
export const deleteSubcategory = async (slug, authtoken) => {
  return await axios.delete(
    `${process.env.REACT_APP_API}/subcategory/${slug}`,
    {
      headers: {
        authtoken
      }
    }
  );
};
