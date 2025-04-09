import { Button, Topbar } from '@/components/shared';
import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';
import { CheckedIcon, UnCheckedIcon, SelectedRadioIcon, UnSelectedRadioIcon } from '@/components/shared/icon';
import { PostFormData, usePostForm } from '@/hooks/usePostForm';
import { usePost } from '@/hooks/usePost';
import { CommunityCard } from '../CommunityCard';

const CATEGORIES = [
  { id: 0, name: 'Restaurant' },
  { id: 1, name: 'Shopping' },
  { id: 2, name: 'Lodging' },
  { id: 3, name: 'Art' },
  { id: 4, name: 'Transportation' },
  { id: 5, name: 'Daily Life' },
  { id: 6, name: 'Cafe/Dessert' },
  { id: 7, name: 'Attraction' },
  { id: 8, name: 'Nature' },
  { id: 9, name: 'Health' },
  { id: 10, name: 'Others' },
] as const;

const POST_TYPES = [
  { label: 'Blog', value: 'blog' },
  { label: 'Question', value: 'qna' },
] as const;

interface PreviewProps {
  onNext: () => void;
  onExit: () => void;
}

const Title = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="font-medium text-lg mb-1 text-text-default">{children}</h1>;
};

const Description = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-base text-text-default">{children}</p>;
};

const SectionInfo = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="w-full mb-4">
      <Title>{title}</Title>
      <Description>{description}</Description>
    </div>
  );
};

export const Preview = ({ onNext, onExit }: PreviewProps) => {
  const { type, categoryId, title } = useCommunityFormStateContext();
  const { setType, setCategoryId } = useCommunityFormActionContext();
  const { handleSubmit } = usePostForm();
  const { createPost } = usePost();

  const isValid = type && categoryId.length > 0;

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value as 'blog' | 'qna');
    setCategoryId([]);
  };

  const handleCategorySelect = (id: number) => {
    if (type === 'qna') {
      if (!categoryId.includes(id)) {
        setCategoryId([id]);
      }
    } else {
      setCategoryId((prev) => {
        if (prev.includes(id)) {
          return prev.filter((_id) => _id !== id);
        }
        return [...prev, id];
      });
    }
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      data.type = type;
      data.categoryId = categoryId;
      await createPost(data);
      onNext();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form className="font-roboto" onSubmit={handleSubmit(onSubmit)}>
      <Topbar title="Post Preview" type="back" isNext={true} onBack={onExit} />
      <div className="bg-bg-medium w-full h-full pt-20 px-4">
        <SectionInfo
          title="Post Preview"
          description="Here's a sneak peek of how your blog preview will look once it's published in the community space."
        />
        <div className="px-2 pb-6">
          <CommunityCard
            userId="@user" // UserId가져와야함  실제 유저 ID로 대체
            date={new Date().toLocaleDateString()} // 현재 날짜 사용
            title={title || 'Untitled'}
            category={categoryId.map(String)}
            profileImageUrl="https://via.placeholder.com/40" // TODO: 실제 프로필 이미지 URL로 대체
            imageUrl="https://via.placeholder.com/40" // 유저 이미지 가져와야함
            likes={0}
            comments={0}
            isBookmarked={false} // 초기값 false
            onLike={() => {}}
            onBookmark={() => {}}
          />
        </div>
      </div>
      <div className="w-full mt-6 px-4">
        <SectionInfo title="Type of a post" description="Please select the correct type of post." />
        <div className="w-full flex flex-col items-start mb-4">
          <div className="w-full grid grid-cols-2 gap-4">
            {POST_TYPES.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 py-2 px-3 rounded-lg border-2 border-border-default"
              >
                <input
                  type="radio"
                  name="post-type"
                  value={option.value}
                  checked={type === option.value}
                  onChange={handleTypeChange}
                  className="hidden"
                />
                {type === option.value ? <SelectedRadioIcon /> : <UnSelectedRadioIcon />}
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`w-full mt-14 px-4 border-t border-border-default transition-all duration-500 ease-in-out ${
          type ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="mt-3 mb-[18px]">
          <Button type="submit" variant="solid" color="primary" size="large" className="w-full" disabled={!isValid}>
            Post
          </Button>
        </div>
        <SectionInfo
          title="Select categories"
          description={
            type === 'qna'
              ? 'Choose one category that fits your question.'
              : 'Choose at least one category that fits your blog. Feel free to select multiple categories.'
          }
        />
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-start cursor-pointer gap-1 py-2 px-3 rounded-lg border-2 border-border-default"
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className="h-6 w-6 flex items-center justify-center">
                {categoryId.includes(category.id) ? <CheckedIcon /> : <UnCheckedIcon />}
              </div>
              <span className="text-sm font-normal">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
