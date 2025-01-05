import axios from 'axios';

export const deleteProfile = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:4000/api/profiles/${id}`);
    console.log('Profile deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw new Error('Failed to delete profile');
  }
};
