import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks';

export const Description = () => {
  const { description } = useCommunityFormStateContext();
  const { setDescription } = useCommunityFormActionContext();

  return (
    <textarea
      id="description"
      className="w-full resize-none focus:outline-none py-4 px-4"
      placeholder="Start writing a blog or question"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />
  );
};
