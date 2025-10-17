import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetch } from "./useFetch";

const usePostMutation = (post, queryKey) => {
  const queryClient = useQueryClient();
  const myFetch = useFetch();
  const updatePostInCache = (prev, updateFn) => {
    const updatePost = (p) => (p.id === post.id ? updateFn(p) : p);
    if (!prev) {
      return;
    }
    if (prev.new_post && prev.new_follower_posts) {
      return {
        ...prev,
        new_post: prev.new_post.map(updatePost).filter((p) => p !== null),
        new_follower_posts: prev.new_follower_posts
          .map(updatePost)
          .filter((p) => p !== null),
      };
    }
    if (prev.user && prev.user.posts) {
      return {
        ...prev,
        user: {
          ...prev.user,
          posts: prev.user.posts.map(updatePost).filter((p) => p !== null),
        },
      };
    }
    if (prev.posts) {
      return {
        ...prev,
        posts: prev.posts.map(updatePost).filter((p) => p !== null),
      };
    }

    if (prev.post) return { ...prev, post: updateFn(post) };

    return prev;
  };

  const createMutation = (mutationFn, updateFn) =>
    useMutation({
      mutationFn,
      onMutate: async () => {
        await queryClient.cancelQueries(queryKey);
        const rollback = queryClient.getQueryData(queryKey);
        queryClient.setQueryData(queryKey, (prev) =>
          updatePostInCache(prev, updateFn)
        );
        return { rollback };
      },
      onError: (error, variables, context) => {
        if (context.rollback)
          queryClient.setQueriesData(queryKey, context.rollback);
        else console.log("No roll back!");
      },
      onSettled: () => {
        if (queryKey[0] !== "like-feed")
          queryClient.invalidateQueries(queryKey); //
      },
    });

  const likePost = createMutation(
    () => myFetch(`/api/posts/${post.id}/like`, { method: "POST" }),
    (post) => ({
      ...post,
      likes: [true],
      _count: { ...post._count, likes: post._count.likes + 1 },
    })
  );

  const unlikePost = createMutation(
    () => myFetch(`/api/posts/${post.id}/unlike`, { method: "POST" }),
    (post) => ({
      ...post,
      likes: [],
      _count: { ...post._count, likes: post._count.likes - 1 },
    })
  );

  const deletePost = createMutation(
    () => myFetch(`/api/posts/${post.id}`, { method: "DELETE" }),
    (post) => null
  );

  return { likePost, unlikePost, deletePost };
};

export default usePostMutation;
