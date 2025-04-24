import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks/useCommunityFormContext';
import { TextField } from '@/components/shared';

export const Title = () => {
  const { title } = useCommunityFormStateContext();
  const { setTitle } = useCommunityFormActionContext();

  return (
    <div className="flex justify-center items-center mx-4">
      <TextField
        id="title"
        type="text"
        label="Title of a post"
        placeholder="Type here"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
  );
};
