import { apiClient, authClient } from '@/api/axiosConfig';
import {
  EmailVerifyRequest,
  ProfileEditFormData,
  SendCodeRequest,
  SignupRequest,
  UserIdCheckRequest,
  VerifyCodeRequest,
} from '@/types';

export const userService = {
  emailVerify: async (data: EmailVerifyRequest) => {
    const response = await apiClient.post('/auth/email/check', data);
    return response.data;
  },
  sendCode: (data: SendCodeRequest) => {
    apiClient.post('/auth/email/send', data);
  },
  verifyCode: async (data: VerifyCodeRequest) => {
    const response = await apiClient.post('/auth/email/code', data);
    return response.data;
  },
  userIdCheck: async (data: UserIdCheckRequest) => {
    const response = await apiClient.post('/auth/userId/check', data);
    return response.data;
  },
  signup: async (data: SignupRequest) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  getUserDrafts: async () => {
    const response = await authClient.get('/user/drafts');
    return response.data;
  },
  getUserProfile: async () => {
    const response = await authClient.get('/user');
    return response.data;
  },
  editProfile: async (data: ProfileEditFormData) => {
    const formData = new FormData();

    const { bio, profileImage } = data;
    if (bio) {
      formData.append('bio', JSON.stringify({ bio }));
    }
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }
    const response = await authClient.patch('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
