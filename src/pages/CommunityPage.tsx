import { Navbar } from '@/components/shared/navbar/Navbar';
import { SwiperList } from '@/components/shared/community/swiper';
import { Tab } from '@/components/shared/community/tab';

const mockData = [
  {
    userImg: 'https://via.placeholder.com/40',
    userName: 'John Doe',
    createdAt: '2025-02-03',
    title: 'Exciting News: React 19 is Coming!',
    content: 'React 19 is set to release with exciting new features...',
    postImg: 'https://via.placeholder.com/100',
    postHeart: 120,
    postComment: 15,
    postBookmark: true,
  },
  {
    userImg: 'https://via.placeholder.com/40',
    userName: 'Jane Smith',
    createdAt: '2025-02-02',
    title: 'How to Build a Scalable Web App',
    content: 'Scalability is key to modern web applications...',
    postImg: 'https://via.placeholder.com/100',
    postHeart: 95,
    postComment: 20,
    postBookmark: false,
  },
  {
    userImg: 'https://via.placeholder.com/40',
    userName: 'Alex Johnson',
    createdAt: '2025-02-01',
    title: 'Mastering JavaScript in 2025',
    content: 'JavaScript continues to evolve, here’s what you need to know...',
    postImg: 'https://via.placeholder.com/100',
    postHeart: 200,
    postComment: 35,
    postBookmark: true,
  },
];

export function CommunityPage() {
  return (
    <>
      <Navbar withSearch />
      <div>
        <SwiperList cards={mockData} />
        <Tab />
      </div>
    </>
  );
}
