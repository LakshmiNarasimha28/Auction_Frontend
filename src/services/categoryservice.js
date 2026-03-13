import API from "./axios";

// Get all categories
export const getCategories = async () => {
  try {
    const response = await API.get("/categories");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const response = await API.get(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new category (admin only)
export const createCategory = async (categoryData) => {
  try {
    const response = await API.post("/categories", categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a category (admin only)
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await API.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a category (admin only)
export const deleteCategory = async (categoryId) => {
  try {
    const response = await API.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
