import { Comment } from '@/types';
import { formatRelativeDate } from '@/utils/utils';
import { FaRegHeart } from 'react-icons/fa';
import defaultImg from '@/assets/images/default-profile.png';

interface CommentListProps {
  comments: Comment[];
}

export const CommentList = ({ comments }: CommentListProps) => {
  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-2 mb-4">
          <img src={defaultImg} alt="Profile" className="w-[28px] h-[28px] rounded-full" />
          <div className="font-roboto flex-1">
            <div className="bg-bg-default p-3 rounded-xl">
              <div className="flex justify-start items-center text-text-weak">
                <span className="text-xs font-medium border-r-[1px] border-solid border-border-default pr-2">
                  @{comment.writerId}
                </span>
                <span className="text-xs pl-2">{formatRelativeDate(comment.createdAt, comment.modifiedAt)}</span>
              </div>
              <p className="text-sm text-text-default mt-1">{comment.description}</p>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center w-full gap-1 cursor-pointer">
                <button
                  // onClick={() => handleLike(blog.data.id, blog.data.isHearted)}
                  className="transition-colors hover:[&>svg]:text-red-500"
                >
                  {/* {blog.data.isHearted ? ( */}
                  {/* <FaHeart className="w-6 h-6 text-red-500 fill-current" /> */}
                  {/* // ) : ( */}
                  <FaRegHeart className="w-5 h-5 text-text-weak stroke-current" />
                  {/* // )} */}
                </button>
                <span>3</span>
              </div>
              <button className="text-xs font-medium text-text-default cursor-pointer">Reply</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
