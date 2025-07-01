import { useNavigate, useSearchParams } from 'react-router-dom';
import { TabList, TabWrapper } from './Tab';

const menuArr = [
  { name: 'Saved', id: 1 },
  { name: 'My post', id: 2 },
  { name: 'Orders', id: 3 },
];

export function MypageTab() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentTab = searchParams.get('tab') || 'Saved';

  // 탭 변경 시 URL 업데이트
  const handleTabChange = (tabName: string) => {
    navigate(`/profile?tab=${encodeURIComponent(tabName)}`, { replace: true });
  };

  return (
    <TabWrapper type="secondary">
      <TabList>
        {menuArr.map((menu) => (
          <button
            key={menu.id}
            onClick={() => handleTabChange(menu.name)}
            className={`
              w-full h-full pb-2 rounded-t-md transition-colors duration-300 font-medium leading-[24px]
              ${
                currentTab === menu.name
                  ? 'text-text-brand-default border-b-[3px] border-border-brand-default'
                  : 'text-text-weak'
              }
            `}
          >
            {menu.name}
          </button>
        ))}
      </TabList>
    </TabWrapper>
  );
}
