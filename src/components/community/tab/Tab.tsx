// const menuArr = [{ name: 'Curated blog' }, { name: 'User blog' }, { name: 'Q&A' }];

function TabWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center w-[360px] h-[50px] bg-gradient-to-r from-primary-light to-primary">
      {children}
    </div>
  );
}

// function TabList({ children }: { chilfren: React.ReactNode }) {
//     return (
//         <div>

//         </div>
//     )

// }

export function Tab() {
  return (
    <TabWrapper>
      <div>가나다</div>
    </TabWrapper>
  );
}
