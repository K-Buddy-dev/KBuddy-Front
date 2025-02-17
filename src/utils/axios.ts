import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.bnbong.xyz/kbuddy/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent': 'KBuddy/1.0.0 (Android 10; SM-G950U Build/R16NW) Flutter/2.2.3', // 공통 헤더
  },
});

export default axiosInstance;
