import { Typography } from './Typography';

interface InfoMessageProps {
  title: string;
  description: string;
}

export function InfoMessage({ title, description }: InfoMessageProps) {
  return (
    <div className="pt-6 pb-4 w-full">
      <Typography variant="title">{title}</Typography>
      <Typography variant="description">{description}</Typography>
    </div>
  );
}
