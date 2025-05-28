import apiClient from './apiClient';

const login = async (username) => {
  try {
    // The API endpoint requires filtering by username
    const response = await apiClient.get(`/users?username=${encodeURIComponent(username)}`);
    // MockAPI usually returns an array even for specific queries
    if (response.data && response.data.length > 0) {
      // Assuming the first user found is the correct one
      return {
        success: true,
        user: response.data[0],
      };
    } else {
      // User not found
      return {
        success: false,
        error: 'User not found.',
      };
    }
  } catch (error) {
    console.error('Login API Error:', error.response || error.message);
    // Handle network errors or other API issues
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred during login. Please try again.',
    };
  }
};

export default {
  login,
};

