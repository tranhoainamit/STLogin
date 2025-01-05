import axios from 'axios';

export const updateProfile = async (id, data) => {
  try {
    const response = await axios.put(`http://localhost:4000/api/profiles/${id}`, data);
    console.log('Profile updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update profile');
  }
};
