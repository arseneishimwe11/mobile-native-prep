import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://67ac71475853dfff53dab929.mockapi.io/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
