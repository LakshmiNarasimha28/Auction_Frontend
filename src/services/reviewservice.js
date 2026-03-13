import API from "./axios";

// Submit a review
export const submitReview = async (auctionId, reviewData) => {
  try {
    const response = await API.post(`/reviews/${auctionId}`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user reviews
export const getUserReviews = async (userId) => {
  try {
    const response = await API.get(`/reviews/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get review stats
export const getReviewStats = async (userId) => {
  try {
    const response = await API.get(`/reviews/${userId}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Respond to a review
export const respondToReview = async (reviewId, response) => {
  try {
    const res = await API.patch(`/reviews/${reviewId}/respond`, { response });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await API.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  submitReview,
  getUserReviews,
  getReviewStats,
  respondToReview,
  deleteReview
};
