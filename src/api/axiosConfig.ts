import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.k-buddy.kr/kbuddy/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

const authClient = axios.create({
  baseURL: 'https://api.k-buddy.kr/kbuddy/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kBuddyAccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originRequest = error.config;
    if (error.response.status === '401' && !originRequest._retry) {
      originRequest._retry = true;
      try {
        const { data } = await axios.post('토큰 리프래쉬 주소', {});
        const { accessToken } = data;
        localStorage.setItem('kBuddyAccessToken', accessToken);
        originRequest.headers.Authorization = `Bearer ${accessToken}`;
        return authClient(originRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
