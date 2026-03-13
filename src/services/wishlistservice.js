import API from "./axios";

// Add auction to wishlist
export const addToWishlist = async (auctionId) => {
  try {
    const response = await API.post(`/wishlist/${auctionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Remove auction from wishlist
export const removeFromWishlist = async (auctionId) => {
  try {
    const response = await API.delete(`/wishlist/${auctionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user's wishlist
export const getUserWishlist = async () => {
  try {
    const response = await API.get("/wishlist");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Check if auction is in wishlist
export const checkInWishlist = async (auctionId) => {
  try {
    const response = await API.get(`/wishlist/check/${auctionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get wishlist count
export const getWishlistCount = async () => {
  try {
    const response = await API.get("/wishlist/count");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  checkInWishlist,
  getWishlistCount
};
