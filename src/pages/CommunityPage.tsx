import { Navbar } from '@/components/shared/navbar/Navbar';
import { Link } from 'react-router-dom';

import { Tab } from '@/components/community/tab';

import { useLocation } from 'react-router-dom';
import { BlogList, FloatPostAction } from '@/components';
import { QnaList } from '@/components/community';
// import { SwiperList } from '@/components/community/swiper';

export function CommunityPage() {
  const location = useLocation();

  const currentTab = decodeURIComponent(location.search.replace('?tab=', '')) || 'Curated blog';

  return (
    <>
      <Navbar withSearch />
      <div>
        {/* <SwiperList cards={mockData} /> */}
        <Tab />
      </div>
      <Link
        to="/community/post"
        className="absolute right-4 bottom-24 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      >
        <FloatPostAction />
      </Link>
      {currentTab === 'User blog' && <BlogList />}
      {currentTab === 'Q&A' && <QnaList />}
    </>
  );
}
