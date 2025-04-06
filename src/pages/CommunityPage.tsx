import { Navbar } from '@/components/shared/navbar/Navbar';
// import { SwiperList } from '@/components/shared/community/swiper';
import { Tab } from '@/components/shared/community/tab';
// import CommunityCard from '@/components/community/CommunityCard';
import { useLocation } from 'react-router-dom';
import QnaList from '@/components/community/QnaList';
import { FloatPostAction } from '@/components';
// import BlogList from '@/components/community/BlogList';

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
      <button className="fixed right-4 bottom-3 -translate-x-1/2 -translate-y-1/2">
        <FloatPostAction />
      </button>
      {/* {currentTab === 'User blog' && <BlogList />} */}
      {currentTab === 'Q&A' && <QnaList />}
    </>
  );
}
