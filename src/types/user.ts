export interface ProfileEditFormData {
  userId?: string;
  profileImage?: File | null;
  bio?: string | null;
}

export interface BasicUserData {
  userId: string;
  profileImageUrl: string | null;
  bio: string | null;
}

export interface User extends BasicUserData {
  country: string;
  createdDate: string;
  email: string;
  firstName: string;
  gender: string;
  id: number;
  isActive: boolean;
  lastName: string;
  profileImageUrl: string | null;
  roles: string[];
  userId: string;
}
