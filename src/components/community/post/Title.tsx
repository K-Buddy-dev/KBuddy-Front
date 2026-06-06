import { useCommunityFormActionContext, useCommunityFormStateContext } from '@/hooks/useCommunityFormContext';
import { TextField } from '@/components/shared';

interface TitleProps {
  label?: string;
  placeholder?: string;
}

export const Title = ({ label = 'Title of a post', placeholder = 'Type here' }: TitleProps) => {
  const { title } = useCommunityFormStateContext();
  const { setTitle } = useCommunityFormActionContext();

  return (
    <div className="flex justify-center items-center mx-4">
      <TextField
        id="title"
        type="text"
        label={label}
        placeholder={placeholder}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
  );
};
