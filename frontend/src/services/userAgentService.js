import axios from 'axios';

export const getRandomUserAgent = async () => {
  const response = await axios.get('http://localhost:4000/api/profiles/user-agent/random');
  return response.data;
};
