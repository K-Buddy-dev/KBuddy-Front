import { MenuItem } from './MenuItem';
import { HomeIcon, ProfileIcon, CommunityIcon, AlarmIcon } from '@/components/shared/icon';

interface AdminSidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

interface MenuItemConfig {
  id: string;
  label: string;
  icon: JSX.Element;
}

const menuItems: MenuItemConfig[] = [
  {
    id: 'dashboard',
    label: '대시보드',
    icon: <HomeIcon />,
  },
  {
    id: 'users',
    label: '사용자 관리',
    icon: <ProfileIcon />,
  },
  {
    id: 'posts',
    label: '게시글 관리',
    icon: <CommunityIcon />,
  },
  {
    id: 'reports',
    label: '신고 관리',
    icon: <AlarmIcon />,
  },
];

export const AdminSidebar = ({ activeMenu, onMenuClick }: AdminSidebarProps) => {
  return (
    <aside className="w-60 h-screen bg-white border-r border-border-weak2 flex-shrink-0">
      <nav className="p-4 flex flex-col gap-1">
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            active={activeMenu === item.id}
            onClick={() => onMenuClick(item.id)}
          />
        ))}
      </nav>
    </aside>
  );
};
