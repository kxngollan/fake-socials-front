"use client";

import "./post.css";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useFetch } from "@/hooks/useFetch";
import PostCard from "@/components/postcard/PostCard";
import CommentCard from "@/components/commentcard/CommentCard";
import BackNav from "@/components/backnav/BackNav";
import CreateComment from "@/components/createcomment/CreateComment";
import Loader from "@/components/loaders/Loader";
import BadRequest from "@/components/error/BadRequest";

const Post = () => {
  const params = useParams();
  const postId = params.postId;
  const getPost = useFetch();
  const route = useRouter();
  const postQuery = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(`/api/posts/single/${postId}`),
  });
  const { post } = postQuery?.data || {};
  if (post === null) return route.push("/p/home");

  return (
    <div className="content view-post">
      <div>
        <BackNav label="Post" />
        {postQuery.isLoading ? (
          <Loader loading={postQuery.isLoading} color="black" />
        ) : postQuery.isError ? (
          <BadRequest />
        ) : (
          <>
            <PostCard
              post={post}
              pageQueryKey={["post", postId]}
              showDelete={true}
            />
            <CreateComment postId={post.id} />

            <p>View comments ({post._count.comments})</p>
            <div className="comment-section">
              {post.comments &&
                post.comments.map((comment) => (
                  <CommentCard
                    comment={comment}
                    postId={post.id}
                    key={comment.id}
                  />
                ))}
            </div>
          </>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default Post;
