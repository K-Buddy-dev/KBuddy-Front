import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminTopbar } from './AdminTopbar';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  userName?: string;
  onLogout?: () => void;
  defaultActiveMenu?: string;
}

export const AdminLayout = ({ children, userName, onLogout, defaultActiveMenu = 'dashboard' }: AdminLayoutProps) => {
  const [activeMenu, setActiveMenu] = useState(defaultActiveMenu);
  const navigate = useNavigate();

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    // Navigate to admin routes
    if (menuId === 'dashboard') {
      navigate('/admin');
    } else {
      navigate(`/admin/${menuId}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-medium">
      <AdminTopbar userName={userName} onLogout={onLogout} />
      <div className="flex">
        <AdminSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
        <main className="flex-1 p-6">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
