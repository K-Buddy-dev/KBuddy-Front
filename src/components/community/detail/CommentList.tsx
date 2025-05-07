interface Comment {
  id: number;
  blogId: number;
  writerId: number;
  description: string;
  createdAt: string;
  modifiedAt: string;
}

interface CommentListProps {
  comments: Comment[];
}

export const CommentList = ({ comments }: CommentListProps) => {
  return (
    <div className="my-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-2 mb-2">
          <img src="https://via.placeholder.com/40" alt="Profile" className="w-8 h-8 rounded-full" />
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-text-default">@{comment.writerId}</span>
              <span className="text-xs text-text-weak">{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-text-default">{comment.description}</p>
            <div className="flex gap-2 mt-1">
              <button className="text-xs text-text-weak">♥ 3</button>
              <button className="text-xs text-text-weak">Reply</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
