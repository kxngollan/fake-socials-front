import "./ReplyCard.css";
import { formatDistanceToNowStrict } from "date-fns";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import useCommentMutation from "@/hooks/useCommentMutation";
import Image from "next/image";

const ReplyCard = ({ comment, refetch }) => {
  const written_time = formatDistanceToNowStrict(new Date(comment.createdAt));
  const { likeComment, unlikeComment } = useCommentMutation(
    comment,
    -1,
    refetch
  );

  return (
    <div className="reply-card">
      <div className="reply-header">
        {comment.user.profile ? (
          <Image src={comment.user.profile.profilePicture} alt="" />
        ) : (
          <Image
            src={
              "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            width={0}
            height={0}
            alt=""
          />
        )}

        <span>{comment.user.username}</span>
        <span>•</span>
        <span>{written_time} ago</span>
      </div>
      <p className="reply-body">{comment.body}</p>
      <div className="reply-buttons">
        {comment.likes.length > 0 ? (
          <p>
            <IconHeartFilled
              className="red-heart"
              onClick={(e) => {
                e.stopPropagation();
                unlikeComment.mutate();
              }}
            />
            {comment._count.likes}
          </p>
        ) : (
          <p>
            <IconHeart
              onClick={(e) => {
                e.stopPropagation();
                likeComment.mutate();
              }}
            />
            {comment._count.likes}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReplyCard;
