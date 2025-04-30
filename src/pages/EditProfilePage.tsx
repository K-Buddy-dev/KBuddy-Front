import { Button, Label, TextField, Topbar } from '@/components';
import { BasicUserData } from '@/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function EditProfilePage() {
  const navigate = useNavigate();
  const [basicUserData, setBasicUserData] = useState<BasicUserData>(
    JSON.parse(localStorage.getItem('basicUserData') || '{}')
  );

  const onChangeUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBasicUserData({ ...basicUserData, userId: e.target.value });
  };

  const onChangeBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 30) {
      return;
    }
    setBasicUserData({ ...basicUserData, bio: e.target.value });
  };

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const handleWebFileSelection = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];

        // 파일 크기 제한 (5MB)
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
          alert('파일 크기는 5MB를 초과할 수 없습니다.');
          return;
        }

        // 파일 형식 검증
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
          alert('JPEG, PNG 형식의 이미지만 업로드 가능합니다.');
          return;
        }

        // 이전 URL 객체 해제
        if (profileImageUrl) {
          URL.revokeObjectURL(profileImageUrl);
        }

        setProfileImage(file);
        setProfileImageUrl(URL.createObjectURL(file));
      }
    };

    input.click();
  };

  const handleImageSelection = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'getAlbum', type: 'Profile' }));
    } else {
      handleWebFileSelection();
    }
  };

  console.log(profileImage);

  return (
    <div className="relative min-h-[calc(100vh-80px)]">
      <Topbar title="Edit profile" type="back" onBack={() => navigate(-1)} />
      <div className="px-4 pt-20 flex flex-col items-center">
        <div className="flex flex-col mb-10">
          <img
            src={profileImageUrl ? profileImageUrl : '/images/default-profile.png'}
            className="w-20 h-20 rounded-full mb-2"
          />
          <span
            className="w-20 text-end text-text-default font-semibold text-sm underline cursor-pointer"
            onClick={handleImageSelection}
          >
            Edit photo
          </span>
        </div>
        <TextField id="userId" label="User ID" value={basicUserData?.userId} onChange={onChangeUserId} />
        <div className="w-full flex flex-col items-start pb-[42px]">
          <Label id="bio" label={'Bio'} />
          <textarea
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
          <Button variant="solid" color="primary">
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
