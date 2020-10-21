import axios from 'axios';

// create category
export const createCategory = async (category, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/category/create`,
    category,
    {
      headers: {
        authtoken
      }
    }
  );
};

// read categories
export const getAllCategories = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/category/all`);
};

export const getCategory = async (slug) => {
  return await axios.get(`${process.env.REACT_APP_API}/category/read/${slug}`);
};

export const getCategorySubcategories = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/category/${_id}/subcategories`
  );
};

// update category
export const updateCategory = async (slug, category, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/category/update/${slug}`,
    category,
    {
      headers: {
        authtoken
      }
    }
  );
};

// delete category
export const deleteCategory = async (slug, authtoken) => {
  return await axios.delete(
    `${process.env.REACT_APP_API}/category/delete/${slug}`,
    {
      headers: {
        authtoken
      }
    }
  );
};
