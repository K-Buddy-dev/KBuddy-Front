import { Link } from 'react-router-dom';

export const NoContent = ({ type }: { type: 'blog' | 'qna' }) => {
  const contentType = {
    blog: {
      title: 'user blogs',
      action: 'blog',
      path: '/community/post',
    },
    qna: {
      title: 'Q&A',
      action: 'qusetion',
      path: '/community/post',
    },
  };

  const { title, action, path } = contentType[type];

  return (
    <section className="mx-4 px-4 py-3 bg-bg-medium rounded-lg font-roboto flex flex-col gap-2 items-center justify-center text-text-default text-xs ">
      <p className="font-normal text-center">
        {`There aren’t any ${title} available to view.`}
        <br />
        {`Be the first one to post a ${action}!`}
      </p>
      <Link to={path} className="font-semibold underline">{`Write a ${action}`}</Link>
    </section>
  );
};
