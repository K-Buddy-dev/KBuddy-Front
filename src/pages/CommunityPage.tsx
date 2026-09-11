import { useLoginPrompt } from '@/hooks/useLoginPrompt';
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
  const { requireLogin } = useLoginPrompt();

  //링크 시맨틱은 유지하고, 게스트일 때만 이동을 막고 안내를 띄운다.
  const handleWritePost = (event: React.MouseEvent) => {
    if (!requireLogin('Log in to write a post.')) {
      event.preventDefault();
    }
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState<string>(() => {
    return searchParams.get('keyword') || '';
  });
  const { toast, hideToast } = useToast();

  const currentTab = searchParams.get('tab') || 'Buddy';
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

  const contentType = currentTab === 'Userblog' || currentTab === 'Buddy' ? 'blog' : 'qna';
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
      <Link
        to="/community/post"
        onClick={handleWritePost}
        className="fixed right-4 bottom-[92px] cursor-pointer sm:right-[calc(50%-260px-16px)]"
      >
        <FloatPostAction />
      </Link>
      {currentTab === 'Buddy' && (
        <BlogList type="BUDDY" title="Buddy profiles" onLike={listHandleLike} onBookmark={listHandleBookmark} />
      )}
      {currentTab === 'Userblog' && (
        <BlogList type="GENERAL" title="All blogs" onLike={listHandleLike} onBookmark={listHandleBookmark} />
      )}
      {currentTab === 'Q&A' && <QnaList onLike={listHandleLike} onBookmark={listHandleBookmark} />}
    </>
  );
};
