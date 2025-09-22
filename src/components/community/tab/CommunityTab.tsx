import { useNavigate, useSearchParams } from 'react-router-dom';
import { TabList, TabWrapper } from './Tab';

const menuArr = [
  { name: 'Curated blog', id: 1 },
  { name: 'User blog', id: 2 },
  { name: 'Q&A', id: 3 },
];

export function CommunityTab() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getCleanTabName = (tabName: string) => {
    return tabName.replace(/\s+/g, '');
  };

  const currentTabParam = searchParams.get('tab') || 'Curatedblog';
  const currentTab = menuArr.find((menu) => getCleanTabName(menu.name) === currentTabParam)?.name || 'Curatedblog';

  // 탭 변경 시 URL 업데이트 (공백 제거)
  const handleTabChange = (tabName: string) => {
    const cleanTabName = getCleanTabName(tabName);
    navigate(`/community?tab=${encodeURIComponent(cleanTabName)}`, { replace: true });
  };

  return (
    <TabWrapper>
      <TabList>
        {menuArr.map((menu) => (
          <button
            key={menu.id}
            onClick={() => handleTabChange(menu.name)}
            className={`
              w-full h-full pb-2 rounded-t-md transition-colors duration-300 font-medium leading-[24px]
              ${
                currentTab === menu.name
                  ? 'text-white border-b-[3px] border-white'
                  : 'text-text-brand-weakDown hover:bg-bg-brand-light'
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
