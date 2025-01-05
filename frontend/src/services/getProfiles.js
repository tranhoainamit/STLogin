import axios from 'axios';

export const getProfiles = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/profiles');
    console.log('Fetched profiles:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw new Error('Failed to fetch profiles');
  }
};
