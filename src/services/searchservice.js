import API from "./axios";

// Search auctions
export const searchAuctions = async (query) => {
  try {
    const response = await API.get("/search", { params: query });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get trending auctions
export const getTrendingAuctions = async () => {
  try {
    const response = await API.get("/search/trending");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get ending soon auctions
export const getEndingSoonAuctions = async () => {
  try {
    const response = await API.get("/search/ending-soon");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get auctions by category
export const getAuctionsByCategory = async (categoryId) => {
  try {
    const response = await API.get(`/search/category/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get auctions by user/seller
export const getAuctionsByUser = async (userId) => {
  try {
    const response = await API.get(`/search/seller/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get winning auctions
export const getWinningAuctions = async () => {
  try {
    const response = await API.get("/search/winning");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get auction stats
export const getAuctionStats = async () => {
  try {
    const response = await API.get("/search/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Advanced filter
export const advancedFilter = async (filterParams) => {
  try {
    const response = await API.get("/search/advanced", { params: filterParams });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  searchAuctions,
  getTrendingAuctions,
  getEndingSoonAuctions,
  getAuctionsByCategory,
  getAuctionsByUser,
  getWinningAuctions,
  getAuctionStats,
  advancedFilter
};
