import { Button, Navbar } from '@/components';
import { authService } from '@/services';
import { User } from '@/types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultProfileImage from '@/assets/images/default-profile.png';
export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const onClickEditProfile = () => {
    navigate('/profile/edit');
  };

  const onClickSettings = () => {
    navigate('/settings');
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await authService.getUserProfile();
        setUser(response.data);
        const basicUserData = response.data;
        localStorage.setItem('basicUserData', JSON.stringify(basicUserData));
      } catch (error) {
        console.error(error);
      }
    };

    getUserProfile();
  }, []);

  return (
    <>
      <Navbar withSearch={false} onClickSettings={onClickSettings} />
      <div className="flex flex-col px-4 pt-4 pb-5 text-text-default">
        <div className="flex gap-2 items-center mb-2">
          <img
            src={user?.profileImageUrl ? user.profileImageUrl : defaultProfileImage}
            alt="profile"
            className="w-12 h-12 rounded-full"
          />
          <span className="font-medium">@{user?.userId}</span>
        </div>
        <div className="mb-5">{user?.bio}</div>
        <Button variant="outline" color="secondary" className="w-full" onClick={onClickEditProfile}>
          Edit profile
        </Button>
      </div>
    </>
  );
}
