import defaultImg from '@/assets/images/default-profile.png';
import { getCategoryNames } from '@/utils/utils';

interface ContentProps {
  writerName: string;
  date: string;
  profileImageUrl?: string;
  title: string;
  categoryId: number[] | number;
  imageUrl?: string;
}

export const Content: React.FC<ContentProps> = ({ writerName, date, profileImageUrl, title, categoryId, imageUrl }) => {
  const categoryNames = getCategoryNames(categoryId);
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center justify-start gap-2 mb-2">
          <img src={profileImageUrl || defaultImg} alt="Profile" className="w-10 h-10 rounded-full" />
          <div className="font-roboto font-medium">
            <p className="text-xs text-text-default">@{writerName}</p>
            <p className="text-xs text-text-weak">{date}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-roboto font-medium">{title}</h2>
          <p className="text-sm font-roboto font-normal text-gray-600">{categoryNames}</p>
        </div>
      </div>
      {imageUrl ? (
        <div>
          <img src={imageUrl} alt={title} className="w-[100px] h-[100px] object-cover rounded" />
        </div>
      ) : (
        <div className="w-[100px] h-[100px]"></div>
      )}
    </div>
  );
};
