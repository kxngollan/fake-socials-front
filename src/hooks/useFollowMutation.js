import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetch } from "./useFetch";
const useFollowMutation = (user, queryKey) => {
  const queryClient = useQueryClient();
  const myFetch = useFetch();

  const updateData = (data, updateFn) => {
    const checkBeforeUpdate = (u) => (u.id !== user.id ? u : updateFn(u));
    if (!data) return;
    if (data.user) {
      return {
        ...data,
        user: updateFn(data.user),
      };
    } else if (data.new_users && data.top_users) {
      return {
        ...data,
        new_users: data.new_users.map(checkBeforeUpdate),
        top_users: data.top_users.map(checkBeforeUpdate),
      };
    } else return data;
  };
  const createMutation = (mutationFn, updateFn) =>
    useMutation({
      mutationFn,
      onMutate: async () => {
        await queryClient.cancelQueries(queryKey);
        const rollback = queryClient.getQueryData(queryKey);
        queryClient.setQueryData(queryKey, (data) =>
          updateData(data, updateFn)
        );
        return { rollback };
      },
      onError: (error, variables, context) => {
        console.log(error);
        if (context.rollback)
          queryClient.setQueryData(queryKey, context.rollback);
        else console.log("Missing rollback");
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
    });
  const follow = createMutation(
    () => myFetch(`/api/users/${user.id}/follow`, { method: "POST" }),
    (user) => ({
      ...user,
      followers: [true],
      _count: user._count
        ? {
            ...user._count,
            followers: user._count.followers + 1,
          }
        : user._count,
    })
  );
  const unfollow = createMutation(
    () => myFetch(`/api/users/${user.id}/unfollow`, { method: "POST" }),
    (user) => ({
      ...user,
      followers: [],
      _count: user._count
        ? {
            ...user._count,
            followers: user._count.followers - 1,
          }
        : user._count,
    })
  );

  return { follow, unfollow };
};

export default useFollowMutation;
