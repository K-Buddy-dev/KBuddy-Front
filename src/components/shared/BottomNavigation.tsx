import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, CommunityIcon, ServiceIcon, MessageIcon, ProfileIcon } from './icon';
import { cn } from '@/utils/utils';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Home',
      icon: <HomeIcon isActive={false} />,
      activeIcon: <HomeIcon isActive={true} />,
    },
    {
      path: '/community',
      label: 'Community',
      icon: <CommunityIcon isActive={false} />,
      activeIcon: <CommunityIcon isActive={true} />,
    },
    {
      path: '/service',
      label: 'Service',
      icon: <ServiceIcon isActive={false} />,
      activeIcon: <ServiceIcon isActive={true} />,
    },
    {
      path: '/message',
      label: 'Message',
      icon: <MessageIcon isActive={false} />,
      activeIcon: <MessageIcon isActive={true} />,
    },
    {
      path: '/profile',
      label: 'My page',
      icon: <ProfileIcon isActive={false} />,
      activeIcon: <ProfileIcon isActive={true} />,
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-w-[280px] w-full sm:w-[600px] bg-white border-t border-border-weak2 shadow-sm h-20 mx-auto">
      <div className="flex justify-evenly items-center h-full">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));

          return (
            <div
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="flex flex-col items-center justify-center px-4 py-1 cursor-pointer gap-1"
            >
              <div className="w-full flex items-center justify-center">{isActive ? item.activeIcon : item.icon}</div>
              <span
                className={cn(
                  'text-xs mt-1 text-center',
                  isActive ? 'text-text-brand-default font-medium' : 'text-text-weak font-normal'
                )}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
