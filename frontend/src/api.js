// API service for communicating with backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making API calls
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add body if it exists and is not a GET request
    if (options.body && config.method !== 'GET') {
      config.body = JSON.stringify(options.body);
    }

    try {
      console.log(`🔄 API Call: ${config.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Success: ${config.method || 'GET'} ${url}`);
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${config.method || 'GET'} ${url}`, error);
      throw error;
    }
  }

  // Feedback API methods

  // Get all feedback
  async getAllFeedback() {
    return this.request('/feedback');
  }

  // Submit new feedback
  async submitFeedback(feedbackData) {
    return this.request('/feedback', {
      method: 'POST',
      body: feedbackData,
    });
  }

  // Delete feedback
  async deleteFeedback(id) {
    return this.request(`/feedback/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Test connection
  async testConnection() {
    try {
      const health = await this.healthCheck();
      console.log('✅ Backend connection test:', health);
      return true;
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;