import { BlogCategory } from '@/types/blog';

interface ContentProps {
  title: string;
  category: BlogCategory;
  imageUrl?: string;
}

export const Content: React.FC<ContentProps> = ({ title, category, imageUrl }) => {
  return (
    <div className="mb-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-600">{category}</p>
      {imageUrl && <img src={imageUrl} alt={title} className="w-full h-40 object-cover rounded mt-2" />}
    </div>
  );
};
