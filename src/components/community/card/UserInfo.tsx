interface UserInfoProps {
  id: string;
  date: string;
  profileImageUrl?: string;
}

export const UserInfo: React.FC<UserInfoProps> = ({ id, date, profileImageUrl }) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <img src={profileImageUrl || 'https://via.placeholder.com/40'} alt="Profile" className="w-10 h-10 rounded-full" />
      <div>
        <p className="text-sm font-semibold">{id}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
  );
};
