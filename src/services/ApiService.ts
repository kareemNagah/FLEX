
// This service is responsible for making API calls to your FastAPI backend

const API_BASE_URL = 'http://localhost:8000/api'; // Update this with your FastAPI URL when deployed

export const ApiService = {
  get: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Include credentials if you need cookies/authentication
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText}\n${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`GET request to ${API_BASE_URL}${endpoint} failed:`, error);
      throw error;
    }
  },

  post: async <T>(endpoint: string, data: any): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText}\n${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`POST request to ${API_BASE_URL}${endpoint} failed:`, error);
      throw error;
    }
  },
  
  delete: async (endpoint: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText}\n${errorText}`);
      }
      
      // For 204 No Content responses, return without trying to parse JSON
      if (response.status === 204) {
        return;
      }
      
      // For other successful responses, parse JSON
      return await response.json();
    } catch (error) {
      console.error(`DELETE request to ${API_BASE_URL}${endpoint} failed:`, error);
      throw error;
    }
  },

  put: async <T>(endpoint: string, data: any): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`PUT request to ${API_BASE_URL}${endpoint} failed:`, error);
      throw error;
    }
  },

  // The delete method is already implemented above
  // This is a duplicate that was removed to avoid conflicts
};
