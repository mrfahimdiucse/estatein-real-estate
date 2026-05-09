const API_URL = '/api';

const mapProperty = (prop: any) => ({
  ...prop,
  id: prop._id || prop.id
});

export const propertyService = {
  getAll: async (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = `${API_URL}/properties?${query}`;
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          const text = await response.text();
          console.error(`Non-JSON error response from ${url}:`, text.substring(0, 200));
          throw new Error(`Server returned error ${response.status}: ${text.substring(0, 50)}...`);
        }
        throw new Error(errorData.details || errorData.error || `Failed to fetch properties (${response.status})`);
      }
      
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data && data.properties && Array.isArray(data.properties)) {
          return {
            ...data,
            properties: data.properties.map(mapProperty)
          };
        }
        return Array.isArray(data) ? data.map(mapProperty) : data;
      } catch (e) {
        console.error(`Malformed JSON from ${url}:`, text.substring(0, 200));
        throw new Error(`Server returned invalid JSON from ${url}`);
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    const url = `${API_URL}/properties/${id}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(`Server returned ${response.status}`);
        }
        throw new Error(errorData.error || 'Property not found');
      }
      const data = await response.json();
      return mapProperty(data);
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      throw error;
    }
  },
  
  create: async (data: any) => {
    const url = `${API_URL}/properties`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error('Failed to create property');
        }
        throw new Error(errorData.error || 'Failed to create property');
      }
      const result = await response.json();
      return mapProperty(result);
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },
  
  update: async (id: string | number, data: any) => {
    const url = `${API_URL}/properties/${id}`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error('Failed to update property');
        }
        throw new Error(errorData.error || 'Failed to update property');
      }
      const result = await response.json();
      return mapProperty(result);
    } catch (error) {
      console.error(`Error updating property ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string | number) => {
    const url = `${API_URL}/properties/${id}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error('Failed to delete property');
        }
        throw new Error(errorData.error || 'Failed to delete property');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error);
      throw error;
    }
  }
};
