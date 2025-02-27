import { useTabsStore } from '@/store';

const menuArr = [
  { name: 'Curated blog', id: 1 },
  { name: 'User blog', id: 2 },
  { name: 'Q&A', id: 3 },
];

function TabWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-end min-w-[280px] w-full sm:w-[600px] h-[50px] bg-gradient-to-r from-bg-brand-light to-bg-brand-default">
      {children}
    </div>
  );
}

function TabList({ children }: { children: React.ReactNode }) {
  return <div className="w-full h-full flex items-end justify-center px-4">{children}</div>;
}

export function Tab() {
  const { activeTab, setActiveTab } = useTabsStore();

  return (
    <TabWrapper>
      <TabList>
        {menuArr.map((menu, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(menu.id)}
            className={`
              w-full h-full px-[7.5px] pb-2 rounded-t-md transition-colors duration-300 font-roboto font-medium leading-[24px]
              ${
                activeTab === menu.id
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
