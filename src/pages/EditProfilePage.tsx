import { Button, Label, TextField, Topbar } from '@/components';
import { BasicUserData } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultProfileImage from '@/assets/images/default-profile.png';
import { authService } from '@/services';
import { base64ToFile } from '@/utils/utils';

export function EditProfilePage() {
  const navigate = useNavigate();
  const [basicUserData, setBasicUserData] = useState<BasicUserData>(
    JSON.parse(localStorage.getItem('basicUserData') || '{}')
  );
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(basicUserData?.profileImageUrl || null);

  const onChangeBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 30) {
      return;
    }
    setBasicUserData({ ...basicUserData, bio: e.target.value });
  };

  const handleAlbumDataFromRN = (event: MessageEvent) => {
    if (typeof event.data !== 'string') return;

    try {
      const data = JSON.parse(event.data);

      switch (data.action) {
        case 'albumData':
          if (data.album && data.album.length > 0) {
            const file = base64ToFile(data.album[0], 'selected-image-0.jpg');
            if (profileImageInputRef.current) {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              profileImageInputRef.current.files = dataTransfer.files;
            }
            setProfileImageUrl(data.album[0]);
          }
          break;
      }
    } catch (e) {
      console.error('앨범 데이터 파싱 실패:', e);
    }
  };

  const onChangeProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];

      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        // setError({ profileImage: '파일 크기는 5MB를 초과할 수 없습니다.' });
        return;
      }

      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        // setError({ profileImage: 'JPEG, PNG 형식의 이미지만 업로드 가능합니다.' });
        return;
      }

      if (profileImageUrl) {
        URL.revokeObjectURL(profileImageUrl);
      }

      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImageSelection = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'getAlbum', type: 'Profile' }));
    } else {
      profileImageInputRef.current?.click();
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    try {
      await authService.editProfile(data);
    } catch (error) {
      console.error(error);
    } finally {
      navigate('/profile');
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleAlbumDataFromRN);
    document.addEventListener('message', handleAlbumDataFromRN as EventListener);

    return () => {
      window.removeEventListener('message', handleAlbumDataFromRN);
      document.removeEventListener('message', handleAlbumDataFromRN as EventListener);
    };
  }, []);

  return (
    <form className="relative h-[calc(100vh-80px)]" onSubmit={onSubmit}>
      <Topbar title="Edit profile" type="back" onBack={() => navigate(-1)} />
      <div className="px-4 pt-20 flex flex-col items-center">
        <input
          type="file"
          name="profileImage"
          className="hidden"
          ref={profileImageInputRef}
          onChange={onChangeProfileImage}
        />
        <div className="flex flex-col mb-10">
          <img src={profileImageUrl ? profileImageUrl : defaultProfileImage} className="w-20 h-20 rounded-full mb-2" />
          <span
            className="w-20 text-center text-text-default font-semibold text-sm underline cursor-pointer"
            onClick={handleImageSelection}
          >
            Edit photo
          </span>
        </div>
        <TextField id="userId" label="User ID" value={basicUserData?.userId} readOnly />
        <div className="w-full flex flex-col items-start pb-[42px]">
          <Label htmlFor="bio" label={'Bio'} />
          <textarea
            id="bio"
            name="bio"
            className="w-full flex-1 h-6 mb-2 bg-transparent outline-none text-gray-900 placeholder-gray-400 resize-none focus:outline-none border border-solid border-border-default rounded-[8px] bg-white box-border py-4 px-4"
            value={basicUserData?.bio ?? ''}
            onChange={onChangeBio}
          />
          <p className="w-full text-text-example text-sm text-end">
            {basicUserData?.bio ? basicUserData?.bio.length : 0} / 30
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-20 box-border border-t border-border-default pt-3 px-4 pb-7">
        <div className="w-full flex justify-between items-center">
          <span
            className="w-[61px] h-full text-center text-text-default font-semibold text-sm underline cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Cancel
          </span>
          <Button variant="solid" color="primary" type="submit">
            Save changes
          </Button>
        </div>
      </div>
    </form>
  );
}
