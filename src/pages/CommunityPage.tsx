import { Navbar } from '@/components/navbar/Navbar';
import { Swiper } from '@/components/community/swiper';

export function CommunityPage() {
  return (
    <>
      <Navbar withSearch />
      <div>
        <Swiper />
      </div>
    </>
  );
}
