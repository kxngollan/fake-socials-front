"use client";

import { formatDistanceToNowStrict } from "date-fns";
import {
  IconHeart,
  IconHeartFilled,
  IconMessage,
  IconMessages,
} from "@tabler/icons-react";
import Image from "next/image";
import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import ReplyCard from "@/components/replycard/ReplyCard";
import Loader from "../loaders/Loader";
import TextareaAutosize from "react-textarea-autosize";
import { useFetch } from "@/hooks/useFetch";
import useCommentMutation from "@/hooks/useCommentMutation";
import "./CommentCard.css";

interface CommentCardProps {
  comment: any;
  postId: string;
}

const CommentCard = ({ comment, postId }: CommentCardProps) => {
  const written_time = formatDistanceToNowStrict(new Date(comment.createdAt));
  const [showReplies, setShowReplies] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();

  const myFetch = useFetch();

  const fetchReplies = async ({ pageParam }: { pageParam: number }) => {
    return await myFetch(`/api/comments/${comment.id}?cursorId=${pageParam}`);
  };

  const fetchPostReply = async () => {
    return await myFetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        parentComment: comment.id,
        body: input,
        postId,
      }),
    });
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["replies", comment.id],
    queryFn: fetchReplies,
    initialPageParam: -1,
    getNextPageParam: (prevData: any) => prevData.cursorId,
    enabled: false,
  });

  const createReplyMutation = useMutation({
    mutationFn: fetchPostReply,
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      setShowInput(false);
      setInput("");
    },
    onError: (err: any) => {
      // toast?.error?.(err.message);
      console.error(err);
    },
  });

  const handleSubmitReply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createReplyMutation.mutate();
  };

  const { likeComment, unlikeComment } = useCommentMutation(comment, postId);
  if (status === "error") return <p>{(error as Error)?.message}</p>;

  return (
    <div className="parent-comment-card">
      <div className="comment-header">
        {comment?.user?.profile?.profilePicture ? (
          <img
            src={comment.user.profile.profilePicture}
            alt="profile picture"
          />
        ) : (
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
            alt="default profile picture"
          />
        )}

        <span
          className="comment-header-name"
          onClick={() => router.push(`/p/users/${comment.user.id}`)}
        >
          {comment.user.username}
        </span>
        <span>•</span>
        <span>{written_time} ago</span>
      </div>

      <p className="comment-body">{comment.body}</p>

      <div className="comment-buttons">
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

        {comment.childComment.length > 0 ? (
          showReplies ? (
            <p onClick={() => setShowReplies(false)}>
              <IconMessages /> Hide replies
            </p>
          ) : (
            <p
              onClick={() => {
                if (!data) fetchNextPage();
                setShowReplies(true);
                setShowInput(false);
              }}
            >
              <IconMessages /> show replies
            </p>
          )
        ) : null}

        <p onClick={() => setShowInput((prev) => !prev)}>
          <IconMessage /> reply
        </p>
      </div>

      {showInput && (
        <form onSubmit={handleSubmitReply}>
          <TextareaAutosize
            required
            className="reply-comment"
            placeholder="Add a reply..."
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <div className="post-reply">
            <Loader loading={createReplyMutation.isPending} />
            <button disabled={createReplyMutation.isPending} type="submit">
              reply
            </button>
          </div>
        </form>
      )}

      {data && showReplies && (
        <div className="group-replies">
          {data.pages.map((group: any, i: number) => (
            <Fragment key={i}>
              {group.replies.map((reply: any) => (
                <ReplyCard comment={reply} key={reply.id} refetch={refetch} />
              ))}
            </Fragment>
          ))}
        </div>
      )}

      {isFetchingNextPage ? (
        <Loader loading={isFetchingNextPage} />
      ) : (
        hasNextPage &&
        showReplies && (
          <p className="loadmore" onClick={() => fetchNextPage()}>
            Load more
          </p>
        )
      )}
    </div>
  );
};

export default CommentCard;
