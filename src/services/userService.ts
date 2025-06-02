import { authClient } from '@/api/axiosConfig';
import { ProfileEditFormData } from '@/types';

export const userService = {
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
