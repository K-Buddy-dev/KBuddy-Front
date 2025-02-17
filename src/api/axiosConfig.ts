import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://43.201.18.43:8080/kbuddy/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
