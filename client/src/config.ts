// Configuration for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:5000',
  },
  production: {
    // Update this to your actual backend URL when you deploy the backend
    apiUrl: 'https://your-backend-domain.com', // You'll need to update this
  },
};

// Get current environment
const env = process.env.NODE_ENV || 'development';

// Export the appropriate config
export const API_BASE_URL = config[env as keyof typeof config].apiUrl;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;
