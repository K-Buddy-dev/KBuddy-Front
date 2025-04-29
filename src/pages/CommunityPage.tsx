import { Navbar } from '@/components/shared/navbar/Navbar';
import { Link, useSearchParams } from 'react-router-dom';

import { Tab } from '@/components/community/tab';

import { BlogList, FloatPostAction } from '@/components';
import { QnaList } from '@/components/community';
// import { SwiperList } from '@/components/community/swiper';

export const CommunityPage = () => {
  const [searchParams] = useSearchParams();

  const currentTab = searchParams.get('tab') || 'Curated blog';

  return (
    <>
      <Navbar withSearch />
      <div>
        {/* <SwiperList cards={mockData} /> */}
        <Tab />
      </div>
      <Link to="/community/post" className="fixed right-8 bottom-24 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
        <FloatPostAction />
      </Link>
      {currentTab === 'User blog' && <BlogList />}
      {currentTab === 'Q&A' && <QnaList />}
    </>
  );
};
