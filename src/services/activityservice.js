import API from "./axios";

// Get user activity
export const getUserActivity = async () => {
  try {
    const response = await API.get("/activity");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get activity by type
export const getActivityByType = async (type) => {
  try {
    const response = await API.get(`/activity/type/${type}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get activity stats
export const getActivityStats = async () => {
  try {
    const response = await API.get("/activity/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get dashboard stats
export const getDashboardStats = async () => {
  try {
    const response = await API.get("/activity/dashboard-stats");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Search activities
export const searchActivities = async (query) => {
  try {
    const response = await API.get("/activity/search", { params: query });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getUserActivity,
  getActivityByType,
  getActivityStats,
  getDashboardStats,
  searchActivities
};
