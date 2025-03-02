import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.k-buddy.kr/kbuddy/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
