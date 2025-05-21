import { Link } from 'react-router-dom';

export const NoContent = ({ type }: { type: string }) => {
  return (
    <section className="mx-4 px-4 py-3 bg-bg-medium rounded-lg font-roboto flex flex-col gap-2 items-center justify-center text-text-default text-xs ">
      <p className="font-normal text-center">
        {`There aren’t any ${type === 'blog' ? 'user blogs' : 'Q&A'} available to view.`}
        <br />
        {`Be the first one to post a ${type === 'blog' ? 'blog' : 'question'}!`}
      </p>
      <Link
        to="/community/post"
        className="font-semibold underline"
      >{`Write a ${type === 'blog' ? 'blog' : 'question'}`}</Link>
    </section>
  );
};
