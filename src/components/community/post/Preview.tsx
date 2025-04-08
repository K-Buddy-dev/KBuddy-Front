import { Checkbox, RadioButtonGroup, Topbar } from '@/components/shared';
import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';

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
    <div className="w-full mt-6 mb-4">
      <Title>{title}</Title>
      <Description>{description}</Description>
    </div>
  );
};

export const Preview = ({ onNext: _, onExit }: PreviewProps) => {
  const { type } = useCommunityFormStateContext();
  const { setType, setCategoryId } = useCommunityFormActionContext();

  return (
    <div className="font-roboto">
      <Topbar title="Post Preview" type="back" isNext={true} onBack={onExit} />
      <div className="bg-bg-medium w-full h-[326px] mt-14 px-4">
        <SectionInfo
          title="Post Preview"
          description="Here's a sneak peek of how your blog preview will look once it's published in the community space."
        />
      </div>
      <div className="w-full mt-14 px-4">
        <SectionInfo title="Type of a post" description="Please select the correct type of post." />
        <RadioButtonGroup
          label="Select a post type"
          id="post-type"
          options={[
            { label: 'Blog', value: 'blog' },
            { label: 'Question', value: 'qna' },
          ]}
          value={type}
          onChange={(e) => setType(e.target.value as 'blog' | 'qna')}
        />
      </div>
      <div className="w-full mt-14 px-4">
        <SectionInfo
          title="Select all categories"
          description="Choose at least one category that fits your blog. Feel free to select multiple categories."
        />
        <p>Category selection</p>
        <div className="grid grid-cols-2">
          {['Restaurant', 'Cafe/Dessert', 'Shopping', 'Attraction', 'Lodging'].map((category) => (
            <div key={category} className="flex items-center justify-between w-[158px] h-[48px]">
              <Checkbox label={category} onChange={() => setCategoryId(1)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
