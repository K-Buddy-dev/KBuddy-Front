interface ContentProps {
  id: string;
  date: string;
  profileImageUrl?: string;
  title: string;
  categoryId: number[];
  imageUrl?: string;
}

export const Content: React.FC<ContentProps> = ({ id, date, profileImageUrl, title, categoryId, imageUrl }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center justify-start gap-2 mb-2">
          <img
            src={profileImageUrl || 'https://via.placeholder.com/40'}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="font-roboto font-medium">
            <p className="text-xs text-text-default">@{id}</p>
            <p className="text-xs text-text-weak">{date}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-roboto font-medium">{title}</h2>
          <p className="text-sm font-roboto font-normal text-gray-600">{categoryId}</p>
        </div>
      </div>
      {imageUrl && <div>{<img src={imageUrl} alt={title} className="w-[100px] h-[100px] object-cover rounded" />}</div>}
    </div>
  );
};
