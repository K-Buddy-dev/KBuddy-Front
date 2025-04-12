const Title = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="font-medium text-lg mb-1 text-text-default">{children}</h1>;
};

const Description = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-base text-text-default">{children}</p>;
};

export const SectionInfo = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="w-full mt-6 mb-4">
      <Title>{title}</Title>
      <Description>{description}</Description>
    </div>
  );
};
