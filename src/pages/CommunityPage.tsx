import { Navbar } from '@/components/shared/navbar/Navbar';
import { Link, useSearchParams } from 'react-router-dom';
import { CommunityTab } from '@/components/community/tab';

import { BlogList, FloatPostAction, Toast } from '@/components';
import { QnaList } from '@/components/community';
import { SwiperList } from '@/components/community/swiper';
import { useContentActions, useFeaturedBlogs } from '@/hooks';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/useToastContext';

export const CommunityPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState<string>(() => {
    return searchParams.get('keyword') || '';
  });
  const { toast, hideToast } = useToast();

  const currentTab = searchParams.get('tab') || 'Curated blog';
  const prevTabRef = useRef<string>(currentTab);

  useEffect(() => {
    if (prevTabRef.current !== currentTab) {
      setSearchKeyword('');
    }
    prevTabRef.current = currentTab;
  }, [currentTab]);

  useEffect(() => {
    const keyword = searchParams.get('keyword') || '';
    setSearchKeyword(keyword);
  }, [searchParams]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (searchKeyword) {
      newSearchParams.set('keyword', searchKeyword);
    } else {
      newSearchParams.delete('keyword');
    }

    setSearchParams(newSearchParams, { replace: true });
  }, [searchKeyword, searchParams]);

  const contentType = currentTab === 'Userblog' ? 'blog' : 'qna';
  const { handleLike: listHandleLike, handleBookmark: listHandleBookmark } = useContentActions({
    contentType,
  });

  const { data: featuredBlog, refetch: refetchFeaturedBlog } = useFeaturedBlogs();

  const { handleLike: featuredHandleLike, handleBookmark: featuredHandleBookmark } = useContentActions({
    contentType: 'blog',
    refetchRecommended: refetchFeaturedBlog,
  });

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={hideToast} />}
      <Navbar withSearch setSearchKeyword={setSearchKeyword} />
      <div>
        {featuredBlog && (
          <SwiperList
            cards={featuredBlog.data.results}
            onLike={featuredHandleLike}
            onBookmark={featuredHandleBookmark}
          />
        )}
        <CommunityTab />
      </div>
      <Link to="/community/post" className="fixed right-4 bottom-[92px] cursor-pointer sm:right-[calc(50%-260px-16px)]">
        <FloatPostAction />
      </Link>
      {currentTab === 'Userblog' && <BlogList onLike={listHandleLike} onBookmark={listHandleBookmark} />}
      {currentTab === 'Q&A' && <QnaList onLike={listHandleLike} onBookmark={listHandleBookmark} />}
    </>
  );
};
