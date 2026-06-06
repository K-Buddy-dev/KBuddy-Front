interface PostStepHeaderProps {
  description: string;
  step: number;
  title: string;
  totalSteps?: number;
}

export const PostStepHeader = ({ description, step, title, totalSteps = 3 }: PostStepHeaderProps) => {
  return (
    <section className="px-4 pb-2">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary-default">
        Step {step} of {totalSteps}
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-text-default">{title}</h1>
      <p className="mt-2 text-sm leading-5 text-text-weak">{description}</p>
    </section>
  );
};
