import axios from 'axios';

export const createProfile = async (data) => {
  try {
    const response = await axios.post('http://localhost:4000/api/profiles', data);
    console.log('Profile created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw new Error('Failed to create profile');
  }
};
