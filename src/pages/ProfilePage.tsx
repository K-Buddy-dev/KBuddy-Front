import { Button, Navbar } from '@/components';
import { BasicUserData } from '@/types';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import defaultProfileImage from '@/assets/images/default-profile.png';
import { authService } from '@/services';
import { MypageTab } from '@/components/community/tab';
import { BookmarkList } from '@/components/mypage/BookmarkList';

export function ProfilePage() {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<BasicUserData | null>(null);
  const navigate = useNavigate();

  const currentTab = searchParams.get('tab') || 'Saved';

  const onClickEditProfile = () => {
    navigate('/profile/edit');
  };

  const onClickSettings = () => {
    navigate('/settings');
  };

  useEffect(() => {
    const getUserProfile = async (): Promise<BasicUserData | null> => {
      try {
        const response = await authService.getUserProfile();
        const basicUserData = response.data;
        localStorage.setItem('basicUserData', JSON.stringify(basicUserData));
        return basicUserData;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    const fetchUserProfile = async () => {
      try {
        const userInfo = await getUserProfile();
        if (userInfo) {
          setUser(userInfo);
        } else {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
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
        {/* 비즈니스 멤버 유무 */}
        <div className="py-4"></div>
        <MypageTab />
      </div>
      {currentTab === 'Saved' && <BookmarkList />}
    </>
  );
}
