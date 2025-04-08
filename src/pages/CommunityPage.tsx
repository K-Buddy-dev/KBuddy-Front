import { Navbar } from '@/components/shared/navbar/Navbar';

import { Tab } from '@/components/community/tab';

import { useLocation } from 'react-router-dom';
import QnaList from '@/components/community/QnaList';
import { FloatPostAction } from '@/components';
import BlogList from '@/components/community/BlogList';
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
      <a
        className="absolute right-4 bottom-3 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        href={'/community/post'}
      >
        <FloatPostAction />
      </a>
      {currentTab === 'User blog' && <BlogList />}
      {currentTab === 'Q&A' && <QnaList />}
    </>
  );
}
