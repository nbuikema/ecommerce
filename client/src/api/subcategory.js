import axios from 'axios';

// create subcategory
export const createSubcategory = async (subcategory, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/subcategory/create`,
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
  return await axios.get(`${process.env.REACT_APP_API}/subcategory/all`);
};

export const getSubcategory = async (slug) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/subcategory/read/${slug}`
  );
};

// update subcategory
export const updateSubcategory = async (slug, subcategory, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/subcategory/update/${slug}`,
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
    `${process.env.REACT_APP_API}/subcategory/delete/${slug}`,
    {
      headers: {
        authtoken
      }
    }
  );
};
